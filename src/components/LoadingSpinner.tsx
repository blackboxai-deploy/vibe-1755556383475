"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", sizeClasses[size], className)} />
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, className, showPercentage = true }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'idle' | 'generating' | 'completed' | 'failed';
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const statusConfig = {
    idle: { color: 'text-gray-500', bg: 'bg-gray-100', icon: '⏳' },
    generating: { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🎬' },
    completed: { color: 'text-green-600', bg: 'bg-green-100', icon: '✅' },
    failed: { color: 'text-red-600', bg: 'bg-red-100', icon: '❌' }
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", config.bg, className)}>
      <span className="text-lg">{config.icon}</span>
      <span className={cn("font-medium", config.color)}>{label}</span>
      {status === 'generating' && <LoadingSpinner size="sm" />}
    </div>
  );
}