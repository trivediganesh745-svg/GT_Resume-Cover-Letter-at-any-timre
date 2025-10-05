import React from 'react';

interface CoverLetterPreviewProps {
  letter: string;
  isGenerating: boolean;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ letter, isGenerating }) => {
  if (!letter && !isGenerating) {
    return (
        <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <h2 className="text-2xl font-semibold mb-2">Cover Letter</h2>
            <p>After refining your resume, you can generate a tailored cover letter here.</p>
        </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Cover Letter</h2>
      <div className="prose prose-slate max-w-none">
        <p className="whitespace-pre-wrap">{letter}{isGenerating && <span className="inline-block w-2 h-4 bg-slate-600 animate-pulse ml-1"></span>}</p>
      </div>
    </div>
  );
};