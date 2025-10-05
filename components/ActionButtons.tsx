
import React from 'react';
import type { ResumeData } from '../types';
import { generatePdf } from '../utils/pdfGenerator';
import { generateDocx } from '../utils/docxGenerator';
import { PdfIcon } from './icons/PdfIcon';
import { DocIcon } from './icons/DocIcon';

type ViewMode = 'resume' | 'cover_letter';

interface ActionButtonsProps {
  isLoading: boolean;
  isRefineDisabled: boolean;
  isGenerateCoverLetterDisabled: boolean;
  onRefine: () => void;
  onGenerateCoverLetter: () => void;
  refinedResume: ResumeData | null;
  coverLetter: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  isRefineDisabled,
  isGenerateCoverLetterDisabled,
  onRefine,
  onGenerateCoverLetter,
  refinedResume,
  coverLetter,
  viewMode,
  setViewMode
}) => {

  const handleDocxDownload = () => {
    if (refinedResume) {
      generateDocx(refinedResume);
    }
  };

  const handlePdfDownload = () => {
    if (refinedResume) {
        generatePdf(refinedResume);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">3. Generate & Download</h3>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onRefine}
            disabled={isRefineDisabled || isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Refine Resume
          </button>
          <button
            onClick={onGenerateCoverLetter}
            disabled={isGenerateCoverLetterDisabled || isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Generate Cover Letter
          </button>
        </div>
      </div>

      {refinedResume && (
        <div>
           <div className="flex space-x-2 border border-gray-200 rounded-md p-1 bg-gray-100 my-4">
                <button
                    onClick={() => setViewMode('resume')}
                    className={`w-full text-sm py-1.5 rounded ${viewMode === 'resume' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Resume
                </button>
                <button
                    onClick={() => setViewMode('cover_letter')}
                    disabled={!coverLetter}
                    className={`w-full text-sm py-1.5 rounded ${viewMode === 'cover_letter' ? 'bg-white shadow' : 'text-gray-600'} disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                    Cover Letter
                </button>
            </div>
          <h3 className="text-md font-semibold text-slate-600 mb-3 border-t pt-4">Download Resume</h3>
          <div className="flex flex-col space-y-3">
             <button
                onClick={handlePdfDownload}
                className="w-full flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                <PdfIcon className="w-5 h-5 mr-2" />
                Download PDF
            </button>
            <button
              onClick={handleDocxDownload}
              className="w-full flex items-center justify-center bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
            >
              <DocIcon className="w-5 h-5 mr-2" />
              Download DOCX
            </button>
          </div>
        </div>
      )}
    </div>
  );
};