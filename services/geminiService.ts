
import { GoogleGenAI } from "@google/genai";

export const getStudyHelp = async (assignmentInstructions: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "API_KEY is not configured. Please contact support.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `You are a friendly and encouraging middle school tutor AI called "Study Buddy". Your goal is to help students understand their assignments without giving them the direct answer.
        
        A student needs help understanding the following assignment instructions:
        ---
        ${assignmentInstructions}
        ---

        Please do the following:
        1.  Start with a friendly greeting.
        2.  Break down the instructions into simple, easy-to-understand steps or bullet points.
        3.  Explain any complex terms in a way a 7th grader would understand.
        4.  Ask a guiding question to help the student get started.
        5.  End with an encouraging message.
        
        Keep your tone positive and helpful.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting study help from Gemini API:", error);
        return "Oops! I'm having a little trouble thinking right now. Please try again in a moment.";
    }
};
