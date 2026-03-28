import { Request, Response } from 'express';
import Country from '../models/Country';
import { generateCountryData as generateCountryDataAI } from '../services/gemini';

// Get all countries
export const getAllCountries = async (req: Request, res: Response) => {
    try {
        const countries = await Country.find().sort({ name: 1 });
        res.status(200).json({ countries });
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Failed to fetch countries', error: error instanceof Error ? error.message : String(error) });
    }
};

// Get country by ID
export const getCountryById = async (req: Request, res: Response) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.status(200).json({ country });
    } catch (error) {
        console.error('Error fetching country:', error);
        res.status(500).json({ message: 'Failed to fetch country', error: error instanceof Error ? error.message : String(error) });
    }
};

// Create a new country
export const createCountry = async (req: Request, res: Response) => {
    try {
        const countryData = req.body;

        // Generate a URL-friendly ID from the name
        if (!countryData.id) {
            countryData.id = countryData.name.toLowerCase().replace(/\s+/g, '-');
        }

        // Check if country already exists
        const existing = await Country.findOne({
            $or: [{ id: countryData.id }, { name: countryData.name }]
        });

        if (existing) {
            return res.status(400).json({ message: 'Country already exists' });
        }

        const country = new Country(countryData);
        await country.save();

        res.status(201).json({ country });
    } catch (error) {
        console.error('Error creating country:', error);
        res.status(500).json({ message: 'Failed to create country', error: error instanceof Error ? error.message : String(error) });
    }
};

// Update a country
export const updateCountry = async (req: Request, res: Response) => {
    try {
        const country = await Country.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        res.status(200).json({ country });
    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ message: 'Failed to update country', error: error instanceof Error ? error.message : String(error) });
    }
};

// Delete a country
export const deleteCountry = async (req: Request, res: Response) => {
    try {
        const country = await Country.findByIdAndDelete(req.params.id);

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        console.error('Error deleting country:', error);
        res.status(500).json({ message: 'Failed to delete country', error: error instanceof Error ? error.message : String(error) });
    }
};

// Toggle country active status
export const toggleCountryStatus = async (req: Request, res: Response) => {
    try {
        const country = await Country.findById(req.params.id);

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        country.isActive = !country.isActive;
        await country.save();

        res.status(200).json({ country });
    } catch (error) {
        console.error('Error toggling country status:', error);
        res.status(500).json({ message: 'Failed to toggle country status', error: error instanceof Error ? error.message : String(error) });
    }
};

// Generate country data using AI
export const generateCountryData = async (req: Request, res: Response) => {
    try {
        const { countryName } = req.body;

        if (!countryName) {
            return res.status(400).json({ message: 'Country name is required' });
        }

        console.log('Generating country data for:', countryName);
        const countryData = await generateCountryDataAI(countryName);

        res.status(200).json({ countryData });
    } catch (error) {
        console.error('Error generating country data:', error);
        res.status(500).json({ message: 'Failed to generate country data', error: error instanceof Error ? error.message : String(error) });
    }
};
