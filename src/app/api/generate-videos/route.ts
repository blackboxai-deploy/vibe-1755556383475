import { NextRequest, NextResponse } from 'next/server';
import { generateAllVideos } from '@/lib/ai-clients';
import { Scene } from '@/types/movie';

export async function POST(request: NextRequest) {
  try {
    const body: { scenes: Scene[] } = await request.json();
    
    if (!body.scenes || !Array.isArray(body.scenes) || body.scenes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Scenes array is required' },
        { status: 400 }
      );
    }

    if (body.scenes.length !== 5) {
      return NextResponse.json(
        { success: false, error: 'Exactly 5 scenes are required' },
        { status: 400 }
      );
    }

    // Validate scene structure
    for (const scene of body.scenes) {
      if (!scene.visualPrompt || !scene.id) {
        return NextResponse.json(
          { success: false, error: 'Each scene must have id and visualPrompt' },
          { status: 400 }
        );
      }
    }

    console.log('Starting video generation for 5 scenes...');
    
    const result = await generateAllVideos(body.scenes);
    
    return NextResponse.json({
      success: result.success,
      data: {
        videos: result.videos,
        totalGenerated: result.videos.filter(v => v.status === 'completed').length,
        totalFailed: result.videos.filter(v => v.status === 'failed').length
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
      message: result.success 
        ? 'All videos generated successfully' 
        : `Video generation completed with ${result.errors.length} errors`
    });

  } catch (error) {
    console.error('Video generation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Set timeout to 15 minutes for video generation
export const maxDuration = 900;