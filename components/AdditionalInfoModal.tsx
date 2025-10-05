import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface AdditionalInfoModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onRefine: (additionalInfo: string) => void;
}

export const AdditionalInfoModal: React.FC<AdditionalInfoModalProps> = ({ isOpen, onCancel, onRefine }) => {
  const [info, setInfo] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleRefineWithAdditions = () => {
    onRefine(info);
    setInfo('');
  };

  const handleSkipAndRefine = () => {
    onRefine('');
    setInfo('');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left flex-grow">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Add Extra Context for the AI?
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Optionally, provide specific instructions, add a new section, or mention something you forgot.
                </p>
            </div>
        </div>
        <div className="mt-4">
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="e.g., 'Please add a Certifications section with my new AWS certificate' or 'Emphasize my experience with team leadership.'"
            className="w-full h-32 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-y"
          />
        </div>
        <div className="mt-5 sm:mt-4 flex flex-col sm:flex-row-reverse gap-3">
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                onClick={handleRefineWithAdditions}
            >
                Refine with Additions
            </button>
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                onClick={handleSkipAndRefine}
            >
                Skip &amp; Refine
            </button>
             <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm sm:mr-auto"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};