import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

const genAI = new GoogleGenerativeAI("AIzaSyC3Y6zPZfyLBTJB_IzVWAjWO6WIjZ-vu0w");
const hf = new HfInference("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");

export async function generateSubtopics(topic: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a sequential learning path for "${topic}" with exactly 8 steps that build upon each other. Each step should be essential to understanding the topic completely.

Keep all text brief and focused. Format as JSON with this exact structure:
{
  "subtopics": [
    {
      "title": "Step 1: (15 words max)",
      "theory": "(50 words max explaining the core concept)",
      "scenario": "(50 words max with a practical example)",
      "connections": ["Previous step", "Next step"]
    }
  ]
}

Rules:
- Exactly 8 sequential steps
- Each step must build upon previous steps
- Number steps clearly (Step 1:, Step 2:, etc.)
- Keep all text VERY brief and within word limits
- No line breaks in text
- Valid JSON format only
- No trailing commas
- Each step connects to next`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    if (!cleanedText.startsWith('{') || !cleanedText.endsWith('}')) {
      throw new Error('Invalid JSON structure');
    }
    
    try {
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.subtopics || !Array.isArray(parsedData.subtopics)) {
        throw new Error('Invalid response structure');
      }
      
      if (parsedData.subtopics.length !== 8) {
        throw new Error('Incorrect number of steps');
      }
      
      parsedData.subtopics.forEach((subtopic: any, index: number) => {
        if (!subtopic.title || !subtopic.theory || !subtopic.scenario || !Array.isArray(subtopic.connections)) {
          throw new Error(`Invalid step structure at step ${index + 1}`);
        }
        
        if (!subtopic.title.startsWith(`Step ${index + 1}:`)) {
          subtopic.title = `Step ${index + 1}: ${subtopic.title}`;
        }
      });
      
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedText);
      return {
        subtopics: [
          {
            title: "Step 1: Understanding Basics",
            theory: "Let's break this topic into simpler steps. Start with the fundamentals.",
            scenario: "Think of it as building blocks - we need to establish the foundation first.",
            connections: ["Start here", "Basics first"]
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    return {
      subtopics: [
        {
          title: "Step 1: Getting Started",
          theory: "We'll help you learn this topic step by step.",
          scenario: "Let's break it down into manageable pieces.",
          connections: ["Begin here", "Step by step"]
        }
      ]
    };
  }
}

async function generateImage(prompt: string): Promise<string> {
  try {
    const enhancedPrompt = `Create a clear, detailed educational illustration of: ${prompt}. Style: Clean, modern, professional educational illustration with clear visual hierarchy. Include relevant visual metaphors and simplified diagrams. Ensure high contrast and readability. Make it suitable for learning purposes.`;

    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: 'blurry, bad quality, distorted, text, watermark, signature, duplicate, multiple images, complex, cluttered, confusing, low contrast',
        guidance_scale: 8.5,
        num_inference_steps: 50,
        width: 1024,
        height: 768
      }
    });

    if (!response) {
      throw new Error('No response from image generation API');
    }

    const buffer = await response.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      throw new Error('Invalid image data received');
    }

    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error in image generation:', error);
    throw new Error('Failed to generate image');
  }
}

export async function generateVisualExplanation(title: string, theory: string): Promise<{ theory: string; imageUrl: string; examTips: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a detailed explanation for "${title}" that helps understand the concept through a real-world scenario.

Your response must follow this exact structure:

1. Introduction (2-3 sentences)
   - What is it?
   - Why is it important?

2. Real-World Analogy
   - Compare it to something familiar
   - Explain how the analogy works

3. Step-by-Step Breakdown
   - Step 1: [Brief explanation]
   - Step 2: [Brief explanation]
   - Step 3: [Brief explanation]

4. Practical Example
   - Scenario setup
   - How it works in this case
   - What we learn from it

5. Key Takeaways
   - Main point 1
   - Main point 2
   - Main point 3

Format the response EXACTLY as this JSON:
{
  "explanation": {
    "scenario": "# Understanding ${title}\\n\\n## What It Is\\n[Introduction here]\\n\\n## Real-World Analogy\\n[Analogy explanation]\\n\\n## How It Works\\n- Step 1: [explanation]\\n- Step 2: [explanation]\\n- Step 3: [explanation]\\n\\n## Practical Example\\n[Example details]\\n\\n## Key Points\\n- [Point 1]\\n- [Point 2]\\n- [Point 3]",
    "keyPoints": ["Brief, memorable point 1", "Brief, memorable point 2", "Brief, memorable point 3"],
    "imagePrompt": "A detailed prompt describing a single, clear visual scene that represents the concept"
  }
}

CRITICAL: 
- Use simple, everyday language
- Avoid technical jargon
- Keep each section focused and clear
- Use bullet points for better readability
- Maintain consistent structure
- Ensure each section flows logically
- NO tables or complex formatting
- VALID JSON format only`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.explanation) {
        throw new Error('Invalid explanation structure');
      }

      const imageUrl = await generateImage(parsedData.explanation.imagePrompt);

      return {
        theory: parsedData.explanation.scenario,
        imageUrl,
        examTips: parsedData.explanation.keyPoints
      };
    } catch (parseError) {
      console.error('Failed to parse explanation:', text);
      return {
        theory: "# Understanding the Concept\n\n## What It Is\nLet's break this down into simpler terms.\n\n## How It Works\n- Start with the basics\n- Build understanding step by step\n- Apply to real situations",
        imageUrl: '',
        examTips: ["Key concept", "Remember this", "Quick tip"]
      };
    }
  } catch (error) {
    console.error('Error generating explanation:', error);
    return {
      theory: "# Learning Guide\n\n## Overview\nWe'll explore this topic step by step.\n\n## Key Points\n- Understanding the basics\n- Building knowledge\n- Practical application",
      imageUrl: '',
      examTips: ["Important point", "Remember", "Quick reference"]
    };
  }
}

export async function generateVisualMindmap(topic: string): Promise<{ theory: string; imageUrl: string; examTips: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a comprehensive explanation of "${topic}" using relatable real-world examples.

Your response must follow this exact structure:

1. Quick Overview (2-3 sentences)
   - What is ${topic}?
   - Why should we care?

2. Simple Explanation
   - Break it down into basic terms
   - Use everyday examples
   - Show why it matters

3. Real-Life Example
   - Set up a familiar scenario
   - Walk through how it works
   - Show the results

4. Step-by-Step Guide
   - First step: Getting started
   - Middle step: Key actions
   - Final step: Achieving results

5. Practical Tips
   - Helpful hint 1
   - Helpful hint 2
   - Helpful hint 3

Format the response EXACTLY as this JSON:
{
  "overview": {
    "scenario": "# ${topic} Made Simple\\n\\n## Overview\\n[Quick introduction]\\n\\n## Basic Concept\\n[Simple explanation]\\n\\n## Real-Life Example\\n[Detailed example]\\n\\n## How To Do It\\n- Step 1: [explanation]\\n- Step 2: [explanation]\\n- Step 3: [explanation]\\n\\n## Helpful Tips\\n- [Tip 1]\\n- [Tip 2]\\n- [Tip 3]",
    "keyPoints": ["Brief, memorable point 1", "Brief, memorable point 2", "Brief, memorable point 3"],
    "imagePrompt": "A detailed prompt describing a single, clear visual scene that represents the concept"
  }
}

CRITICAL: 
- Use simple, everyday language
- Explain as if talking to a friend
- Use familiar examples
- Break down complex ideas
- Keep everything clear and focused
- Use bullet points for clarity
- NO tables or complex formatting
- VALID JSON format only`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.overview) {
        throw new Error('Invalid overview structure');
      }

      const imageUrl = await generateImage(parsedData.overview.imagePrompt);

      return {
        theory: parsedData.overview.scenario,
        imageUrl,
        examTips: parsedData.overview.keyPoints
      };
    } catch (parseError) {
      console.error('Failed to parse overview:', text);
      return {
        theory: "# Simple Guide\n\n## Overview\nLet's learn this topic step by step.\n\n## Key Points\n- Understanding basics\n- Building knowledge\n- Practical use",
        imageUrl: '',
        examTips: ["Main concept", "Key point", "Remember this"]
      };
    }
  } catch (error) {
    console.error('Error generating overview:', error);
    return {
      theory: "# Learning Guide\n\n## Overview\nWe'll explore this concept together.\n\n## Main Points\n- Basic understanding\n- Key concepts\n- Practical application",
      imageUrl: '',
      examTips: ["Core concept", "Quick tip", "Key takeaway"]
    };
  }
}