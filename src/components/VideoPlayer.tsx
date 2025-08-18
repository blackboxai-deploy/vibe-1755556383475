"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GeneratedVideo, Scene } from '@/types/movie';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  video: GeneratedVideo;
  scene: Scene;
  className?: string;
}

export function VideoPlayer({ video, scene, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const downloadVideo = () => {
    if (video.videoUrl) {
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `scene-${scene.id}-${scene.title.replace(/\s+/g, '-').toLowerCase()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = () => {
    switch (video.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating...</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              Scene {scene.id}: {scene.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{scene.description}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent>
        {video.status === 'failed' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 text-lg">❌</span>
              <h4 className="font-medium text-red-800">Video Generation Failed</h4>
            </div>
            <p className="text-red-700 text-sm">
              {video.error || 'An error occurred during video generation'}
            </p>
          </div>
        ) : video.status === 'generating' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <h4 className="font-medium text-blue-800">Generating Video...</h4>
            </div>
            <p className="text-blue-700 text-sm">
              Please wait while we create your video. This may take several minutes.
            </p>
            {video.progress && (
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
                <p className="text-xs text-blue-600 mt-1">{video.progress}% complete</p>
              </div>
            )}
          </div>
        ) : video.videoUrl ? (
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-transparent" />
                </div>
              )}
              {hasError ? (
                <div className="aspect-video flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <span className="text-gray-500 text-2xl">🎬</span>
                    <p className="text-gray-600 mt-2">Video preview unavailable</p>
                  </div>
                </div>
              ) : (
                <video
                  controls
                  className="w-full aspect-video"
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  preload="metadata"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={downloadVideo}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Download Video
              </Button>
              <Button 
                onClick={() => window.open(video.videoUrl, '_blank')}
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-lg">⏳</span>
              <h4 className="font-medium text-gray-700">Waiting for Generation</h4>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Video generation will begin once the script is ready.
            </p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-1">Visual Prompt:</h5>
          <p className="text-sm text-gray-600">{scene.visualPrompt}</p>
        </div>
      </CardContent>
    </Card>
  );
}