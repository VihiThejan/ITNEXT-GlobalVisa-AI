# Country Management Feature

## Overview
The Country Management system allows administrators to add, edit, and manage countries in the ITNEXT GlobalVisa AI platform through an intuitive admin interface.

## Features

### Backend Implementation

1. **Country Model** (`backend/src/models/Country.ts`)
   - MongoDB schema for storing country data
   - Includes all country fields: basic info, economy, job market, education, etc.
   - Supports multiple visa categories per country
   - Active/inactive status for countries

2. **Admin Controller** (`backend/src/controllers/adminController.ts`)
   - `getAllCountries()` - Fetch all countries
   - `getCountryById(id)` - Get specific country details
   - `createCountry(data)` - Add new country
   - `updateCountry(id, data)` - Update existing country
   - `deleteCountry(id)` - Remove country
   - `toggleCountryStatus(id)` - Enable/disable country

3. **API Routes** (`backend/src/routes/adminRoutes.ts`)
   ```
   GET    /api/admin/countries          - List all countries
   GET    /api/admin/countries/:id      - Get country by ID
   POST   /api/admin/countries          - Create new country
   PUT    /api/admin/countries/:id      - Update country
   DELETE /api/admin/countries/:id      - Delete country
   PATCH  /api/admin/countries/:id/toggle - Toggle active status
   ```

### Frontend Implementation

1. **Country Management Component** (`core/components/admin/CountryManagement.tsx`)
   - Comprehensive form for adding/editing countries
   - Real-time form validation
   - Visa category management within country form
   - Visual country cards with action buttons
   - Success/error messaging

2. **Admin Dashboard Integration**
   - New "Country Management" card in dashboard
   - Navigation to country management page
   - Updated sidebar with country management link

3. **API Service** (`core/services/api.ts`)
   - Complete API integration for all country operations
   - Error handling and user feedback

## Usage

### For Administrators

1. **Access Country Management**
   - Log in as admin
   - Navigate to Admin Dashboard
   - Click "Country Management" or use sidebar navigation

2. **Add New Country**
   - Click "Add New Country" button
   - Fill in required fields:
     - Country ID (unique identifier, e.g., "us", "uk", "ca")
     - Country Name
     - Flag Emoji
     - Description
     - Economy, Job Market, Education, PR Benefits
   - Optional fields: History, Geography, Politics, Student Info, Job Info
   - Add visa categories (can add multiple)
   - Click "Create Country"

3. **Edit Existing Country**
   - Click "Edit" on any country card
   - Modify fields as needed
   - Click "Update Country"

4. **Manage Visa Categories**
   - Within the country form, use the "Add Visa Category" section
   - Fill in visa details:
     - Visa ID and Name
     - Purpose
     - Eligibility criteria (add multiple items)
     - Qualifications, Experience, Language, Finance
     - Processing Time
     - Settlement Potential (checkbox)
   - Click "Add This Visa Category"
   - Added visas appear above the form
   - Remove visas using trash icon

5. **Enable/Disable Countries**
   - Click "Enable" or "Disable" on country card
   - Inactive countries won't appear in user-facing pages

6. **Delete Countries**
   - Click trash icon on country card
   - Confirm deletion in popup

## Data Migration

To seed existing countries from constants to database:

```bash
cd backend
npm run seed:countries
```

Or manually:
```bash
cd backend
npx ts-node src/scripts/seedCountries.ts
```

This will:
- Connect to MongoDB
- Clear existing countries
- Insert predefined countries (Canada, UK, Germany, USA)
- Show success message with inserted countries

## Database Schema

```typescript
{
  id: String (unique, required)
  name: String (required)
  flag: String (required)
  description: String (required)
  economy: String (required)
  jobMarket: String (required)
  education: String (required)
  prBenefits: String (required)
  history: String (optional)
  geography: String (optional)
  politics: String (optional)
  studentInfo: String (optional)
  jobInfo: String (optional)
  visas: [VisaCategory] (array)
  isActive: Boolean (default: true)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}

VisaCategory {
  id: String (required)
  name: String (required)
  purpose: String (required)
  eligibility: [String] (array)
  qualifications: String (required)
  experience: String (required)
  language: String (required)
  finance: String (required)
  processingTime: String (required)
  settlementPotential: Boolean (required)
}
```

## Future Enhancements

1. **Bulk Import/Export**
   - CSV/JSON import for countries
   - Export countries for backup

2. **Country Analytics**
   - Track which countries get most assessments
   - Popular visa categories per country

3. **Version History**
   - Track changes to country data
   - Restore previous versions

4. **Media Management**
   - Upload country images
   - Manage country-specific resources

5. **Advanced Search**
   - Filter countries by status
   - Search by visa types
   - Sort by various criteria

## Notes

- Country IDs should be unique and lowercase (e.g., "us", "uk", "ca")
- Flag emojis should be country flag emojis (🇺🇸, 🇬🇧, etc.)
- All required fields must be filled before saving
- Changes are saved to MongoDB and immediately reflected in the system
- Inactive countries remain in database but don't appear to users
