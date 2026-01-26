
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AssessmentResult } from "../types";

/**
 * Robustly extracts and repairs JSON from a potentially truncated or malformed string.
 * Ensures the output always aligns with the expected AssessmentResult structure.
 */
const extractAndRepairJson = (text: string): any => {
  let cleanText = text.trim();
  
  // Remove markdown wrappers if present
  if (cleanText.includes("```json")) {
    cleanText = cleanText.split("```json")[1].split("```")[0];
  } else if (cleanText.includes("```")) {
    const parts = cleanText.split("```");
    cleanText = parts.length >= 3 ? parts[1] : parts[0];
  }
  
  cleanText = cleanText.trim();

  // Primary attempt
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("Initial JSON parse failed, attempting advanced recovery...");
  }

  // Advanced recovery for truncated or slightly malformed JSON
  let repaired = cleanText;
  
  // Trim trailing commas or incomplete property names
  repaired = repaired.replace(/[:,\s]+$/, "");

  // Balance quotes
  const quoteCount = (repaired.match(/"/g) || []).length;
  const escapedQuoteCount = (repaired.match(/\\"/g) || []).length;
  const realQuoteCount = quoteCount - escapedQuoteCount;
  if (realQuoteCount % 2 !== 0) {
    repaired += '"';
  }

  // Balance braces and brackets
  const stack: string[] = [];
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    if (char === '{' || char === '[') {
      stack.push(char === '{' ? '}' : ']');
    } else if (char === '}' || char === ']') {
      if (stack.length > 0 && stack[stack.length - 1] === char) {
        stack.pop();
      }
    }
  }

  while (stack.length > 0) {
    repaired += stack.pop();
  }

  try {
    return JSON.parse(repaired);
  } catch (finalError) {
    console.error("Advanced JSON recovery failed completely.", finalError);
    return null;
  }
};

export const generateAssessment = async (profile: UserProfile, countryName: string): Promise<AssessmentResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Conduct a detailed visa eligibility assessment for ${countryName} based on the user's professional profile.
    
    USER PROFILE CONTEXT:
    - Name: ${profile.firstName} ${profile.lastName}
    - Education: ${profile.educationLevel} in ${profile.fieldOfStudy}
    - Experience: ${profile.workExperienceYears || profile.yearsOfExperience} years
    - Current Professional Summary: ${profile.jobTitle || profile.professionalBackground.substring(0, 150)}
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
    - Return ONLY valid JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite Global Immigration Strategist for ITNEXT. You provide data-driven, accurate pre-assessments. Your goal is to identify diverse pathways beyond just students and workers, including talent and innovation routes. You must provide official government URLs for all identified paths.",
        responseMimeType: "application/json",
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 512 },
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

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No response generated from AI engine.");
    }

    const rawText = response.text || "{}";
    const data = extractAndRepairJson(rawText);
    
    if (!data) {
      throw new Error("Failed to parse valid assessment data from AI response.");
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      targetCountry: data.countryName || countryName,
      targetVisaCategory: (data.eligibleVisas && data.eligibleVisas[0]?.visaName) || "General Assessment",
      countryName: data.countryName || countryName,
      overallScore: data.overallScore || 0,
      status: (data.status as any) || "Not Eligible",
      eligibleVisas: (data.eligibleVisas || []).map((v: any) => ({
        visaId: Math.random().toString(36).substr(2, 5),
        visaName: v.visaName || "Pathway",
        matchScore: v.matchScore || 0,
        reason: v.reason || "Matched based on credentials.",
        missingCriteria: v.missingCriteria || [],
        officialLink: v.officialLink || "#"
      })),
      roadmap: (data.roadmap || []).map((r: any) => ({
        title: r.title || "Next Step",
        description: r.description || "Action item for immigration.",
        duration: r.duration || "TBD",
        requirements: r.requirements || []
      })),
      aiAdvice: data.aiAdvice || "Ensure all documents are verified before proceeding.",
      matchBreakdown: {
        strengths: data.matchBreakdown?.strengths || [],
        weaknesses: data.matchBreakdown?.weaknesses || [],
        improvementPoints: data.matchBreakdown?.improvementPoints || []
      }
    };
  } catch (e) {
    console.error("Gemini Assessment Error:", e);
    throw new Error(e instanceof Error ? e.message : "The immigration engine encountered a technical hurdle. Please try again.");
  }
};
