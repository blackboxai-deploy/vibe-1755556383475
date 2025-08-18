"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MovieScript, GeneratedVideo } from '@/types/movie';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface SceneDisplayProps {
  script: MovieScript;
  videos: GeneratedVideo[];
  className?: string;
}

export function SceneDisplay({ script, videos, className }: SceneDisplayProps) {
  const getVideoForScene = (sceneId: number) => {
    return videos.find(video => video.sceneId === sceneId);
  };

  const getCompletionStats = () => {
    const completed = videos.filter(v => v.status === 'completed').length;
    const failed = videos.filter(v => v.status === 'failed').length;
    const generating = videos.filter(v => v.status === 'generating').length;
    
    return { completed, failed, generating, total: videos.length };
  };

  const stats = getCompletionStats();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Script Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{script.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{script.genre}</Badge>
                <Badge variant="outline">{script.scenes.length} Scenes</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Video Generation Progress</div>
              <div className="flex gap-4 mt-1">
                <span className="text-sm">
                  <span className="font-semibold text-green-600">{stats.completed}</span> Completed
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-blue-600">{stats.generating}</span> Generating
                </span>
                {stats.failed > 0 && (
                  <span className="text-sm">
                    <span className="font-semibold text-red-600">{stats.failed}</span> Failed
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      {videos.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">
                {stats.completed}/{stats.total} videos completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              />
            </div>
            {stats.generating > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                🎬 {stats.generating} video{stats.generating > 1 ? 's' : ''} currently generating...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Scenes */}
      <div className="space-y-4">
        {script.scenes.map((scene) => {
          const video = getVideoForScene(scene.id);
          
          return (
            <VideoPlayer
              key={scene.id}
              scene={scene}
              video={video || {
                sceneId: scene.id,
                videoUrl: '',
                status: 'generating'
              }}
            />
          );
        })}
      </div>

      {/* Generation Summary */}
      {stats.completed === stats.total && stats.total > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="font-semibold text-green-800">All Videos Generated!</h3>
                <p className="text-sm text-green-700">
                  Your complete {script.scenes.length}-scene movie is ready to watch and download.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.failed > 0 && stats.generating === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Partial Generation Complete</h3>
                <p className="text-sm text-yellow-700">
                  {stats.completed} of {stats.total} videos generated successfully. 
                  {stats.failed} video{stats.failed > 1 ? 's' : ''} failed to generate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}