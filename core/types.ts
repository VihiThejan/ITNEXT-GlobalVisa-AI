
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
}

export interface Country {
  id: string;
  name: string;
  flag: string;
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
  visas: VisaCategory[];
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
  ageRange: string;
  educationLevel: string;
  fieldOfStudy: string;
  professionalBackground: string;
  yearsOfExperience: number;
  // Properties added to support Gemini assessment service
  nationality?: string;
  residence?: string;
  workExperienceYears?: number;
  jobTitle?: string;
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
  matchBreakdown: {
    strengths: string[];
    weaknesses: string[];
    improvementPoints: string[];
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
