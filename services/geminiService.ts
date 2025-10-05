import { GoogleGenAI, Type } from '@google/genai';
import type { ResumeData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    contact: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING, nullable: true },
        portfolio: { type: Type.STRING, nullable: true },
      },
      required: ['name', 'email', 'phone', 'location'],
    },
    summary: {
      type: Type.STRING,
      description: 'A 2-4 sentence professional summary tailored to the job description, highlighting key qualifications.',
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          date: { type: Type.STRING },
          description: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Bullet points describing responsibilities and achievements. Each bullet point should start with a strong action verb and be optimized with keywords from the job description. Quantify achievements with metrics where possible.',
          },
        },
        required: ['role', 'company', 'location', 'date', 'description'],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          date: { type: Type.STRING },
        },
        required: ['degree', 'institution', 'date'],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            category: { type: Type.STRING, description: 'e.g., "Programming Languages", "Cloud Technologies", "Developer Tools"' },
            items: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['category', 'items']
      }
    },
    customSections: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "A paragraph of text for the custom section. Use newline characters ('\\n') for lists if needed." },
        },
        required: ['title', 'content']
      },
      description: 'Optional new sections like "Projects" or "Certifications" if they exist in the original resume and are highly relevant to the job description.'
    }
  },
  required: ['contact', 'summary', 'experience', 'education', 'skills'],
};

export const refineResume = async (resumeText: string, jobDescription: string, additionalInfo: string): Promise<ResumeData> => {
  
  const additionalInfoPromptSection = additionalInfo
    ? `
    **Additional User Instructions (Highest Priority):**
    The user has provided the following specific instructions, additions, or modifications. You MUST incorporate these into your response. For example, if they ask to add a new section or skill, you must add it.
    ---
    ${additionalInfo}
    ---
    `
    : '';

  const prompt = `
    Analyze the following resume text and job description. Refine the resume to be ATS-friendly and perfectly tailored for the specific job.
    ${additionalInfoPromptSection}
    **Key Instructions:**
    1.  **Keyword Integration:** Seamlessly integrate relevant keywords and phrases from the job description into the resume's experience and summary sections.
    2.  **Action Verbs & Quantifiable Results:** Rephrase bullet points to start with strong action verbs. Where possible, quantify achievements (e.g., "Increased efficiency by 15%" instead of "Made things more efficient").
    3.  **Preserve Integrity:** DO NOT invent new experiences, skills, or dates. Only rephrase and enhance existing information, unless the user has provided new information in the 'Additional User Instructions' section. Faithfully transfer all original sections.
    4.  **Structure Adherence:** Strictly adhere to the provided JSON schema for the output. Transfer sections like "Projects" or "Certifications" into the 'customSections' array if they exist.

    **Original Resume Text:**
    ---
    ${resumeText}
    ---

    **Target Job Description:**
    ---
    ${jobDescription}
    ---
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an expert career coach and professional resume writer specializing in optimizing resumes for Applicant Tracking Systems (ATS). Your goal is to refine a user\'s resume to maximize its chances of passing through an ATS and impressing a human recruiter for a specific job.',
      responseMimeType: 'application/json',
      responseSchema: resumeSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as ResumeData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("Received invalid JSON from the AI model.");
  }
};


export async function* generateCoverLetterStream(resumeData: ResumeData, jobDescription: string): AsyncGenerator<string> {
    const prompt = `
        Based on the candidate's refined resume and the specific job description, write a professional and compelling cover letter.

        **Key Instructions:**
        1.  **Personalization:** Address it to the "Hiring Manager" and sign off with the candidate's name, ${resumeData.contact.name}.
        2.  **Structure:** Follow a clear 3-4 paragraph structure:
            *   **Introduction:** State the position being applied for and express enthusiasm.
            *   **Body Paragraph(s):** Highlight 2-3 key experiences or skills from the resume that directly align with the most important requirements in the job description. Use specific examples.
            *   **Conclusion:** Reiterate interest in the role and include a call to action (e.g., "I am eager to discuss how my skills can benefit your team...").
        3.  **Tone:** Maintain an enthusiastic, confident, and professional tone throughout.
        4.  **Formatting:** Use newline characters ('\\n\\n') to separate paragraphs.

        **Candidate's Refined Resume Data:**
        ---
        ${JSON.stringify(resumeData, null, 2)}
        ---

        **Target Job Description:**
        ---
        ${jobDescription}
        ---
    `;

    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
         config: {
            systemInstruction: 'You are a helpful and experienced career advisor writing a cover letter on behalf of a job applicant. Your tone should be professional yet personable, and your goal is to create a compelling narrative that connects the applicant\'s skills to the employer\'s needs.',
        }
    });

    for await (const chunk of response) {
        yield chunk.text;
    }
};