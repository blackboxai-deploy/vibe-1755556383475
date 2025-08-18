import { MovieScript, AIResponse } from '@/types/movie';

// AI API Configuration - Custom endpoint with no API keys required
const AI_CONFIG = {
  endpoint: 'https://oi-server.onrender.com/chat/completions',
  headers: {
    'customerId': 'cus_SGPn4uhjPI0F4w',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  }
};

// Models configuration
const MODELS = {
  script: 'openrouter/anthropic/claude-sonnet-4',
  video: 'replicate/google/veo-3'
};

// System prompt for script generation
const SCRIPT_GENERATION_PROMPT = `You are an expert screenwriter and film director. Your task is to create a compelling 5-scene movie script based on the user's prompt.

Requirements:
1. Create exactly 5 distinct scenes that flow together as a coherent short film
2. Each scene should be 10-15 seconds when converted to video
3. Provide detailed visual descriptions optimized for AI video generation
4. Include specific camera angles, lighting, and visual elements
5. Make each scene cinematic and visually striking

CRITICAL: Response must be ONLY valid JSON without any markdown formatting, explanations, or code blocks. Do not use markdown code blocks.

Response format (pure JSON only):
{
  "title": "Movie Title",
  "genre": "Genre",
  "scenes": [
    {
      "id": 1,
      "title": "Scene Title",
      "description": "Narrative description of what happens",
      "visualPrompt": "Detailed visual description for video generation including camera work, lighting, colors, mood, and specific visual elements"
    }
  ]
}

Focus on creating scenes that are:
- Visually distinct and memorable
- Technically feasible for AI video generation
- Emotionally engaging
- Cinematically composed`;

export async function generateScript(prompt: string): Promise<AIResponse> {
  try {
    const response = await fetch(AI_CONFIG.endpoint, {
      method: 'POST',
      headers: AI_CONFIG.headers,
      body: JSON.stringify({
        model: MODELS.script,
        messages: [
          {
            role: 'system',
            content: SCRIPT_GENERATION_PROMPT
          },
          {
            role: 'user',
            content: `Create a 5-scene movie script based on this prompt: "${prompt}"`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Script generation failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI model');
    }

    // Clean the content to extract JSON (remove markdown formatting if present)
    let cleanContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON response
    const parsedScript = JSON.parse(cleanContent) as MovieScript;
    
    // Validate the script structure
    if (!parsedScript.scenes || parsedScript.scenes.length !== 5) {
      throw new Error('Generated script does not contain exactly 5 scenes');
    }

    return {
      success: true,
      data: parsedScript
    };
  } catch (error) {
    console.error('Script generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateVideo(visualPrompt: string, sceneId: number): Promise<AIResponse> {
  try {
    const response = await fetch(AI_CONFIG.endpoint, {
      method: 'POST',
      headers: AI_CONFIG.headers,
      body: JSON.stringify({
        model: MODELS.video,
        messages: [
          {
            role: 'user',
            content: `Generate a high-quality 10-15 second cinematic video: ${visualPrompt}. Make it visually stunning with professional cinematography, proper lighting, and smooth camera movements.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Video generation failed: ${response.status}`);
    }

    const data = await response.json();
    const videoUrl = data.choices?.[0]?.message?.content;
    
    if (!videoUrl) {
      throw new Error('No video URL received from AI model');
    }

    return {
      success: true,
      data: { videoUrl, sceneId }
    };
  } catch (error) {
    console.error(`Video generation error for scene ${sceneId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateAllVideos(scenes: any[]): Promise<{ 
  success: boolean; 
  videos: any[]; 
  errors: string[] 
}> {
  const results = await Promise.allSettled(
    scenes.map(scene => generateVideo(scene.visualPrompt, scene.id))
  );

  const videos: any[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      videos.push({
        sceneId: scenes[index].id,
        videoUrl: result.value.data.videoUrl,
        status: 'completed'
      });
    } else {
      const error = result.status === 'rejected' 
        ? result.reason 
        : result.value.error;
      errors.push(`Scene ${scenes[index].id}: ${error}`);
      videos.push({
        sceneId: scenes[index].id,
        videoUrl: null,
        status: 'failed',
        error: error
      });
    }
  });

  return {
    success: errors.length === 0,
    videos,
    errors
  };
}