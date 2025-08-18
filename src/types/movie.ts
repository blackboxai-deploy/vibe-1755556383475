export interface Scene {
  id: number;
  title: string;
  description: string;
  visualPrompt: string;
  duration?: number;
}

export interface MovieScript {
  title: string;
  genre: string;
  scenes: Scene[];
  totalDuration?: number;
}

export interface GeneratedVideo {
  sceneId: number;
  videoUrl: string;
  status: 'generating' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
  userPreferences?: {
    genre?: string;
    style?: string;
    duration?: number;
  };
}

export interface GenerationStatus {
  scriptStatus: 'idle' | 'generating' | 'completed' | 'failed';
  videoStatus: 'idle' | 'generating' | 'completed' | 'failed';
  completedVideos: number;
  totalVideos: number;
  currentStep: string;
  error?: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}