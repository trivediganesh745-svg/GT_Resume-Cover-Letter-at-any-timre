import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { ActionButtons } from './components/ActionButtons';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { parseFile } from './utils/fileParser';
import { refineResume, generateCoverLetterStream } from './services/geminiService';
import { AdditionalInfoModal } from './components/AdditionalInfoModal';
import type { ResumeData } from './types';

type ViewMode = 'resume' | 'cover_letter';

export default function App() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [refinedResume, setRefinedResume] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('resume');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isLoading = loadingMessage !== '';

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      setResumeText('');
      setFileName('');
      return;
    }
    setRefinedResume(null);
    setCoverLetter('');
    setError('');
    setLoadingMessage('Parsing resume...');
    
    setFileName(file.name);
    try {
      const text = await parseFile(file);
      setResumeText(text);
    } catch (e) {
      setError('Failed to parse the file. Please try another one.');
      console.error(e);
    } finally {
      setLoadingMessage('');
    }
  }, []);

  const handleRefineClick = useCallback(() => {
    // This now just opens the modal. The button's disabled state handles validation.
    setIsModalOpen(true);
  }, []);

  const handleCancelRefinement = () => {
    setIsModalOpen(false);
  };
  
  const handleStartRefinement = useCallback(async (additionalInfo: string) => {
    setIsModalOpen(false);
    if (!resumeText || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }
    setLoadingMessage('Optimizing your resume...');
    setError('');
    setRefinedResume(null);
    setCoverLetter('');
    try {
      const result = await refineResume(resumeText, jobDescription, additionalInfo);
      setRefinedResume(result);
      setViewMode('resume');
    } catch (e) {
      setError('Failed to refine resume. The AI model may be overloaded or your API key is invalid.');
      console.error(e);
    } finally {
      setLoadingMessage('');
    }
  }, [resumeText, jobDescription]);

  const handleGenerateCoverLetterClick = useCallback(async () => {
    if (!refinedResume || !jobDescription) {
      setError('Please refine your resume first before generating a cover letter.');
      return;
    }
    setLoadingMessage('Crafting your cover letter...');
    setError('');
    setCoverLetter('');
    setViewMode('cover_letter');
    try {
      const stream = generateCoverLetterStream(refinedResume, jobDescription);
      for await (const chunk of stream) {
        setCoverLetter((prev) => prev + chunk);
      }
    } catch (e) {
      setError('Failed to generate cover letter. Please try again later.');
      console.error(e);
    } finally {
      setLoadingMessage('');
    }
  }, [refinedResume, jobDescription]);
  
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <FileUpload onFileChange={handleFileChange} fileName={fileName} />
            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
             <ActionButtons
              isLoading={isLoading}
              isRefineDisabled={!resumeText || !jobDescription}
              isGenerateCoverLetterDisabled={!refinedResume}
              onRefine={handleRefineClick}
              onGenerateCoverLetter={handleGenerateCoverLetterClick}
              refinedResume={refinedResume}
              coverLetter={coverLetter}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[80vh] relative">
              {isLoading && <Loader message={loadingMessage} />}
              {!isLoading && !refinedResume && (
                 <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h2 className="text-2xl font-semibold mb-2">Welcome to the ATS Resume Optimizer</h2>
                    <p>Get started in 3 simple steps:</p>
                    <ol className="text-left list-decimal list-inside mt-4 space-y-1">
                      <li><span className="font-semibold">Upload your current resume</span> (PDF or DOCX).</li>
                      <li><span className="font-semibold">Paste the job description</span> for the role you want.</li>
                      <li>Click <span className="font-semibold text-blue-600">"Refine Resume"</span> to let the AI work its magic.</li>
                    </ol>
                </div>
              )}
               {!isLoading && refinedResume && viewMode === 'resume' && (
                <ResumePreview data={refinedResume} />
              )}
              {viewMode === 'cover_letter' && (
                 <CoverLetterPreview letter={coverLetter} isGenerating={loadingMessage === 'Crafting your cover letter...'} />
              )}
            </div>
          </div>
        </div>
      </main>
      <AdditionalInfoModal 
        isOpen={isModalOpen}
        onCancel={handleCancelRefinement}
        onRefine={handleStartRefinement}
      />
    </div>
  );
}