import React from 'react';
import { AlertIcon } from './icons/AlertIcon';

export const ApiKeyInstructions: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-lg border border-red-200 p-8 text-center">
        <AlertIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Configuration Required</h1>
        <p className="text-slate-600 text-lg mb-6">
          This application requires a Google Gemini API key to function.
        </p>
        <div className="text-left bg-slate-50 p-4 rounded-md border border-slate-200">
            <p className="font-semibold text-slate-700 mb-2">How to fix this:</p>
            <p className="text-sm text-slate-600">
              The API key must be provided as an environment variable named{' '}
              <code className="bg-slate-200 text-red-600 font-mono p-1 rounded">
                API_KEY
              </code>
              .
            </p>
             <p className="text-sm text-slate-600 mt-4">
              Your application code is trying to access it via{' '}
              <code className="bg-slate-200 font-mono p-1 rounded">
                process.env.API_KEY
              </code>. Please ensure this variable is set in the environment where this application is running.
            </p>
        </div>
        <a 
            href="https://ai.google.dev/gemini-api/docs/api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-6 text-blue-600 hover:text-blue-800 transition-colors"
        >
            Learn how to get an API key &rarr;
        </a>
      </div>
    </div>
  );
};