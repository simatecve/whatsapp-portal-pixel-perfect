
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  type: 'sessions' | 'contacts' | 'error';
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ type, message }) => {
  switch (type) {
    case 'sessions':
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    case 'contacts':
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
          <p className="text-gray-500">Cargando contactos...</p>
        </div>
      );
    case 'error':
      return (
        <div className="py-4 text-center text-red-600">{message}</div>
      );
    default:
      return null;
  }
};

export default LoadingState;
