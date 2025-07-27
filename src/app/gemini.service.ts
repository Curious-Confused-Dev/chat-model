import { GoogleGenAI } from '@google/genai';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateContent(messages: { role: string, text: string, image?: string }[]): Promise<string> {
    // Combine all user messages into one string for simplicity
    const prompt = messages.map(m => m.text).join('\n');
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    // The SDK returns the text in response.text
    return response.text || 'No response';
  }
} 
