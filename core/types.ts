
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider: 'google' | 'email';
  role?: 'user' | 'admin';
  isVerified?: boolean;
  profile?: UserProfile;
  assessmentHistory: AssessmentResult[];
  uniSearchHistory?: UniversitySearchRecord[];
  jobSearchHistory?: JobSearchRecord[];
  countryViewHistory?: CountryViewRecord[];
}

export interface CountryViewRecord {
  id: string;
  date: string;
  countryId: string;
  countryName: string;
}

export interface UniversitySearchRecord {
  id: string;
  date: string;
  criteria: any;
  resultsCount: number;
}

export interface JobSearchRecord {
  id: string;
  date: string;
  criteria: any;
  resultsCount: number;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  image?: string;
  description: string;
  economy: string;
  jobMarket: string;
  education: string;
  prBenefits: string;
  history?: string;
  geography?: string;
  politics?: string;
  studentInfo?: string;
  jobInfo?: string;
  cities?: string[];
  visas: VisaCategory[];
  isActive?: boolean;
}

export interface VisaCategory {
  id: string;
  name: string;
  purpose: string;
  eligibility: string[];
  qualifications: string;
  experience: string;
  language: string;
  finance: string;
  processingTime: string;
  settlementPotential: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  country: string;
  nationality?: string;
  ageRange: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  dependents?: number;
  educationLevel: string;
  fieldOfStudy: string;
  gpa?: string;
  professionalBackground: string;
  jobTitle?: string;
  yearsOfExperience: number;
  skills?: string[];
  mobileNumber?: string;
  countryCode?: string;
  // Properties added to support Gemini assessment service
  residence?: string;
  workExperienceYears?: number;
  languageScores?: {
    test: string;
    score: string;
  };
  visaIntent?: string;
  financialSavings?: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  targetCountry: string;
  countryId?: string;
  targetVisaCategory: string;
  countryName?: string;
  overallScore: number;
  status: 'Fully Eligible' | 'Partially Eligible' | 'Not Eligible';
  eligibleVisas: {
    visaId: string;
    visaName: string;
    matchScore: number;
    reason: string;
    missingCriteria: string[];
    officialLink?: string;
  }[];
  roadmap: RoadmapStep[];
  aiAdvice: string;
  // Support both field names for backward compatibility
  matchBreakdown: {
    strengths: string[];
    weaknesses: string[];
    improvementPoints: string[];
  };
  profileAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
}

export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
  requirements: string[];
}

export interface Consultancy {
  id: string;
  name: string;
  location: string;
  countries: string[];
  specialties: string[];
  rating: number;
  contact: string;
  image: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  rank: string;
  tuition: string;
  matchScore: number;
  description: string;
  keyPrograms: string[];
  intakes: string[];
  websiteUrl: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  industry: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  postedAt: string;
  sponsorshipAvailable: boolean;
  matchScore: number;
  description: string;
  applyUrl: string;
  sourceSite?: string;
  keyRequirements: string[];
  responsibilities?: string[];
  benefits?: string[];
}
