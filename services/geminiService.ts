import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please make sure it is configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        console.log(`Generating image with prompt: "${prompt}" and aspect ratio: ${aspectRatio}`);
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            console.log("Image generated successfully.");
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("The API did not generate any images. This might be due to the prompt being blocked by safety filters. Please try a different prompt.");
        }

    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        // Re-throw the original error to be handled by the UI component
        // which provides more specific error messages from the SDK if available.
        throw error;
    }
};
