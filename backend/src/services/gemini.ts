import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

// Note: Ensure @google/genai is installed. 
// If specific types are needed from frontend, define interfaces here.

export interface UserProfile {
    firstName: string;
    lastName: string;
    educationLevel: string;
    fieldOfStudy: string;
    workExperienceYears: number;
    yearsOfExperience?: number; // legacy support
    jobTitle?: string;
    professionalBackground: string;
    languageScores?: {
        test: string;
        score: string;
    };
}

const extractAndRepairJson = (text: string): any => {
    let cleanText = text.trim();
    if (cleanText.includes("```json")) {
        cleanText = cleanText.split("```json")[1].split("```")[0];
    } else if (cleanText.includes("```")) {
        const parts = cleanText.split("```");
        cleanText = parts.length >= 3 ? parts[1] : parts[0];
    }
    cleanText = cleanText.trim();
    try {
        return JSON.parse(cleanText);
    } catch (e) {
        console.warn("Initial JSON parse failed, attempting advanced recovery...");
        // Simplified recovery for backend - could be robusted if needed
        try {
            const repaired = cleanText.replace(/[:,\s]+$/, "") + '}';
            return JSON.parse(repaired);
        } catch (e2) {
            return null;
        }
    }
};

export const generateAssessmentAI = async (profile: UserProfile, countryName: string) => {
    console.log('=== Starting Assessment Generation ===');
    console.log('Country:', countryName);
    console.log('Profile:', JSON.stringify(profile, null, 2));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY not found in environment');
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    console.log('API Key found:', apiKey.substring(0, 10) + '...');

    try {
        const genAI = new GoogleGenAI({ apiKey });
        console.log('GoogleGenAI initialized');

        const prompt = `
Conduct a detailed visa eligibility assessment for ${countryName} based on the user's professional profile.

USER PROFILE CONTEXT:
- Name: ${profile.firstName} ${profile.lastName}
- Education: ${profile.educationLevel} in ${profile.fieldOfStudy}
- Experience: ${profile.workExperienceYears || profile.yearsOfExperience} years
- Current Professional Summary: ${profile.jobTitle || profile.professionalBackground?.substring(0, 150) || 'Not provided'}
- Language Proficiency: ${profile.languageScores?.test || 'Not specified'} (Score: ${profile.languageScores?.score || 'N/A'})

OUTPUT REQUIREMENTS:
1. Overall eligibility score (0-100).
2. Status classification: 'Fully Eligible', 'Partially Eligible', or 'Not Eligible'.
3. Identify ALL applicable visa pathways including but not limited to Skilled Worker, Student, Global Talent, Innovator Founder, H1-B, Digital Nomad, or Start-up Visas.
4. For EACH pathway identified, provide an official government website URL (e.g., .gov, .gc.ca, .gov.uk, etc.) where the user can find more information.
5. Provide a 3-step Settlement Roadmap detailing the progression from landing to citizenship.
6. A concise piece of expert advice (max 20 words).
7. A DETAILED MATCH BREAKDOWN:
   - Strengths: List why the profile is a good match for the search criteria.
   - Weaknesses: List why it is NOT a match or where it falls short.
   - Improvement Points: List specific actions to boost the score.

STRICT CONSTRAINTS:
- Return ONLY valid JSON.
`;

        console.log('Calling Gemini API...');

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        countryName: { type: Type.STRING },
                        overallScore: { type: Type.NUMBER },
                        status: { type: Type.STRING },
                        eligibleVisas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    visaName: { type: Type.STRING },
                                    matchScore: { type: Type.NUMBER },
                                    reason: { type: Type.STRING },
                                    missingCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    officialLink: { type: Type.STRING }
                                },
                                required: ["visaName", "matchScore", "reason", "missingCriteria", "officialLink"]
                            }
                        },
                        roadmap: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    duration: { type: Type.STRING },
                                    requirements: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["title", "description", "duration", "requirements"]
                            }
                        },
                        aiAdvice: { type: Type.STRING },
                        matchBreakdown: {
                            type: Type.OBJECT,
                            properties: {
                                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                improvementPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["strengths", "weaknesses", "improvementPoints"]
                        }
                    },
                    required: ["countryName", "overallScore", "status", "eligibleVisas", "roadmap", "aiAdvice", "matchBreakdown"]
                }
            }
        });

        console.log('Gemini API response received');

        if (!response) {
            console.error('Response is null or undefined');
            throw new Error("No response generated from AI engine.");
        }

        // Type checking with cast to avoid TS errors if types are mismatched in dev
        const textData = typeof (response as any).text === 'function' ? (response as any).text() : response.text;
        console.log('Text data extracted, length:', textData?.length || 0);

        const finalJson = textData || "{}";
        const data = JSON.parse(finalJson);

        console.log('=== Assessment Generated Successfully ===');
        return data;

    } catch (error) {
        console.error("=== Gemini AI Error ===");
        console.error("Error type:", error?.constructor?.name);
        console.error("Error message:", error instanceof Error ? error.message : String(error));
        console.error("Full error:", error);
        throw error;
    }
};

export const generateCountryData = async (countryName: string) => {
    console.log('=== Starting Country Data Generation ===');
    console.log('Country:', countryName);

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable not set");
        }

        const genAI = new GoogleGenAI({ apiKey });

        const prompt = `You are an expert immigration and global mobility consultant. Generate comprehensive country data for "${countryName}" for an immigration platform.

CRITICAL: For the "flag" field, you MUST use the actual Unicode emoji flag for ${countryName}. For example:
- Australia: 🇦🇺
- United States: 🇺🇸
- United Kingdom: 🇬🇧
- Canada: 🇨🇦
- Germany: 🇩🇪

Please provide accurate, up-to-date information about ${countryName} in the following JSON format:

{
  "name": "Official country name",
  "flag": "ACTUAL Unicode emoji flag (e.g., 🇦🇺 for Australia, NOT the text 'AU')",
  "description": "Brief compelling description (1-2 sentences) about why this country is attractive for immigrants",
  "economy": "Overview of the economy, GDP, main industries, and economic stability (2-3 sentences)",
  "jobMarket": "Current job market situation, in-demand sectors, and opportunities for immigrants (2-3 sentences)",
  "education": "Education system overview, top universities, and opportunities for international students (2-3 sentences)",
  "prBenefits": "Benefits of permanent residency/citizenship, timeline, and key advantages (2-3 sentences)",
  "history": "Brief historical context relevant to immigration (2-3 sentences)",
  "geography": "Geographic overview including location, climate, and landscape (2-3 sentences)",
  "politics": "Political system and stability (1-2 sentences)",
  "studentInfo": "Specific information for international students including work permits and pathways (2-3 sentences)",
  "jobInfo": "Specific information for job seekers including visa programs and opportunities (2-3 sentences)",
  "visas": [
    {
      "id": "unique-id (e.g., ca-ee, uk-sw, au-sc)",
      "name": "Visa category name",
      "purpose": "Brief purpose of this visa (1 sentence)",
      "eligibility": ["Eligibility criterion 1", "Eligibility criterion 2", "Eligibility criterion 3"],
      "qualifications": "Required qualifications summary",
      "experience": "Required work experience",
      "language": "Language requirements (e.g., IELTS 7.0, TOEFL 100)",
      "finance": "Financial requirements",
      "processingTime": "Average processing time",
      "settlementPotential": true/false (whether this visa leads to permanent residency)
    }
  ]
}

Important:
- Include at least 3-5 major visa categories for ${countryName}
- Use accurate, current information as of 2026
- Be specific about visa requirements and processes
- Use proper emoji for the country flag
- Focus on information relevant to skilled workers, students, and families
- Make descriptions compelling but factual

Return ONLY the JSON object, no additional text or markdown formatting.`;

        console.log('Sending request to Gemini...');
        
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        flag: { type: Type.STRING },
                        description: { type: Type.STRING },
                        economy: { type: Type.STRING },
                        jobMarket: { type: Type.STRING },
                        education: { type: Type.STRING },
                        prBenefits: { type: Type.STRING },
                        history: { type: Type.STRING },
                        geography: { type: Type.STRING },
                        politics: { type: Type.STRING },
                        studentInfo: { type: Type.STRING },
                        jobInfo: { type: Type.STRING },
                        visas: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    purpose: { type: Type.STRING },
                                    eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    qualifications: { type: Type.STRING },
                                    experience: { type: Type.STRING },
                                    language: { type: Type.STRING },
                                    finance: { type: Type.STRING },
                                    processingTime: { type: Type.STRING },
                                    settlementPotential: { type: Type.BOOLEAN }
                                },
                                required: ["id", "name", "purpose", "eligibility", "qualifications", "experience", "language", "finance", "processingTime", "settlementPotential"]
                            }
                        }
                    },
                    required: ["name", "flag", "description", "economy", "jobMarket", "education", "prBenefits", "visas"]
                }
            }
        });

        console.log('Received response from Gemini');

        const textData = typeof (response as any).text === 'function' ? (response as any).text() : response.text;
        console.log('Text data extracted, length:', textData?.length || 0);

        const finalJson = textData || "{}";
        const data = JSON.parse(finalJson);

        if (!data || !data.name) {
            console.error('Parsed data:', data);
            throw new Error("Invalid country data generated");
        }

        console.log('=== Country Data Generated Successfully ===');
        console.log('Country name:', data.name);
        console.log('Visas generated:', data.visas?.length || 0);
        
        return data;

    } catch (error) {
        console.error("=== Gemini Country Generation Error ===");
        console.error("Error type:", error?.constructor?.name);
        console.error("Error message:", error instanceof Error ? error.message : String(error));
        console.error("Full error:", error);
        throw error;
    }
};
