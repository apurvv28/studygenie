import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyC-eiFWed8-RzTqSwTOyclYOxHr4M4gbq8");

export async function generateLetterResponse(letter: string, timeDirection: 'past' | 'future') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are ${timeDirection === 'past' ? 'the past' : 'the future'} version of the person who wrote this letter. Write a thoughtful, empathetic, and therapeutic response that acknowledges their feelings and provides wisdom and support. The response should be personal and specific to the content of their letter.

Letter:
${letter}

Write a response that:
1. Shows deep understanding of their emotions
2. Provides comfort and validation
3. Offers gentle wisdom and perspective
4. Maintains a warm, personal tone
5. Ends with encouragement for their journey
6. Write everything in simple words

Keep the response focused on emotional support and personal growth. Start with "Dear ${timeDirection === 'past' ? 'present' : 'past'} self,".`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return `Dear ${timeDirection === 'past' ? 'present' : 'past'} self,

I feel your words deeply and want you to know that you are heard and understood. Your journey is unique and valuable, and every step you take - whether forward or back - is part of your growth. Keep believing in yourself and know that you have the strength within you to face whatever comes your way.

With love and understanding,
Your ${timeDirection} self`;
  }
}