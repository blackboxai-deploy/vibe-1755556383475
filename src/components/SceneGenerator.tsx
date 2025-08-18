"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner, StatusIndicator, ProgressBar } from './LoadingSpinner';
import { SceneDisplay } from './SceneDisplay';
import { MovieScript, GeneratedVideo, GenerationStatus } from '@/types/movie';

const EXAMPLE_PROMPTS = [
  "A thrilling heist in a futuristic city with neon lights and flying cars",
  "A heartwarming story about an elderly man befriending a stray robot",
  "A mysterious forest where ancient trees hold magical secrets",
  "A space station emergency where the crew must work together to survive",
  "A small town detective investigating strange supernatural occurrences"
];

export function SceneGenerator() {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState<MovieScript | null>(null);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [status, setStatus] = useState<GenerationStatus>({
    scriptStatus: 'idle',
    videoStatus: 'idle',
    completedVideos: 0,
    totalVideos: 0,
    currentStep: 'Ready to generate'
  });
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setScript(null);
    setVideos([]);
    setError(null);
    setStatus({
      scriptStatus: 'idle',
      videoStatus: 'idle',
      completedVideos: 0,
      totalVideos: 0,
      currentStep: 'Ready to generate'
    });
  };

  const generateScript = async () => {
    try {
      setError(null);
      setStatus(prev => ({ 
        ...prev, 
        scriptStatus: 'generating',
        currentStep: 'Generating script with AI...'
      }));

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.data);
      setStatus(prev => ({ 
        ...prev, 
        scriptStatus: 'completed',
        currentStep: 'Script completed! Starting video generation...'
      }));

      // Start video generation immediately
      await generateVideos(data.data.scenes);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
      setStatus(prev => ({ 
        ...prev, 
        scriptStatus: 'failed',
        currentStep: 'Script generation failed'
      }));
    }
  };

  const generateVideos = async (scenes: any[]) => {
    try {
      setStatus(prev => ({ 
        ...prev, 
        videoStatus: 'generating',
        totalVideos: scenes.length,
        currentStep: 'Generating videos for all scenes...'
      }));

      // Initialize video states
      const initialVideos = scenes.map(scene => ({
        sceneId: scene.id,
        videoUrl: '',
        status: 'generating' as const,
        progress: 0
      }));
      setVideos(initialVideos);

      const response = await fetch('/api/generate-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate videos');
      }

      setVideos(data.data.videos);
      
      const completedCount = data.data.videos.filter((v: any) => v.status === 'completed').length;
      const failedCount = data.data.videos.filter((v: any) => v.status === 'failed').length;
      
      setStatus(prev => ({ 
        ...prev, 
        videoStatus: failedCount > 0 ? 'failed' : 'completed',
        completedVideos: completedCount,
        currentStep: failedCount > 0 
          ? `Video generation completed with ${failedCount} failures`
          : 'All videos generated successfully!'
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate videos');
      setStatus(prev => ({ 
        ...prev, 
        videoStatus: 'failed',
        currentStep: 'Video generation failed'
      }));
    }
  };

  const isGenerating = status.scriptStatus === 'generating' || status.videoStatus === 'generating';
  const canGenerate = prompt.trim().length > 0 && !isGenerating;
  const hasContent = script && videos.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎬 AI Movie Scene Generator
          </CardTitle>
          <p className="text-gray-600">
            Describe your movie scene idea and watch AI bring it to life with a 5-scene script and videos!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-base font-medium">
              Describe Your Movie Scene
            </Label>
            <Textarea
              id="prompt"
              placeholder="Enter your movie scene idea here... (e.g., 'A thrilling chase scene through a cyberpunk city at night')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-2 min-h-[100px] resize-none"
              maxLength={1000}
              disabled={isGenerating}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">
                {prompt.length}/1000 characters
              </span>
              {prompt.length > 800 && (
                <span className="text-sm text-orange-600">
                  Consider keeping it concise for better results
                </span>
              )}
            </div>
          </div>

          {/* Example Prompts */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Need inspiration? Try these examples:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 px-3"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={generateScript}
              disabled={!canGenerate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  🎬 Generate Movie Scenes
                </>
              )}
            </Button>
            
            {hasContent && (
              <Button 
                onClick={resetState}
                variant="outline"
                disabled={isGenerating}
                size="lg"
              >
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <span className="font-medium">Error:</span> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Status Section */}
      {(status.scriptStatus !== 'idle' || status.videoStatus !== 'idle') && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Generation Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <StatusIndicator 
                    status={status.scriptStatus}
                    label="Script Generation"
                  />
                  <StatusIndicator 
                    status={status.videoStatus}
                    label="Video Generation"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">{status.currentStep}</p>
                {status.videoStatus === 'generating' && status.totalVideos > 0 && (
                  <ProgressBar 
                    progress={(status.completedVideos / status.totalVideos) * 100}
                    showPercentage={true}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {script && (
        <SceneDisplay 
          script={script} 
          videos={videos}
        />
      )}
    </div>
  );
}