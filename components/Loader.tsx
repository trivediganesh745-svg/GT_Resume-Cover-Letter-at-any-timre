import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "AI is working its magic..." }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10 rounded-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-slate-600 font-semibold">{message}</p>
    </div>
  );
};
