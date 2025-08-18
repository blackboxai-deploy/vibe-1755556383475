import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/ai-clients';
import { GenerationRequest } from '@/types/movie';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (body.prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Prompt is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    const result = await generateScript(body.prompt);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Script generated successfully'
    });

  } catch (error) {
    console.error('Script generation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}