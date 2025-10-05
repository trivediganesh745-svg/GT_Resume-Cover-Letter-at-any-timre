
import React from 'react';
import type { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { contact, summary, experience, education, skills, customSections } = data;

  return (
    <div className="text-sm font-sans text-gray-800" id="resume-preview">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{contact.name}</h1>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-600 mt-2">
          <span>{contact.location}</span>
          <span>&bull;</span>
          <a href={`tel:${contact.phone}`} className="hover:text-blue-600">{contact.phone}</a>
          <span>&bull;</span>
          <a href={`mailto:${contact.email}`} className="hover:text-blue-600">{contact.email}</a>
          {contact.linkedin && <><span>&bull;</span><a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">LinkedIn</a></>}
          {contact.portfolio && <><span>&bull;</span><a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Portfolio</a></>}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-gray-200 pb-1 mb-2">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-gray-200 pb-1 mb-2">Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="font-semibold text-gray-900">{exp.role}</h3>
              <p className="text-xs text-gray-600">{exp.date}</p>
            </div>
            <div className="flex justify-between items-baseline text-sm">
              <p className="font-medium text-gray-700">{exp.company}</p>
              <p className="text-xs text-gray-600">{exp.location}</p>
            </div>
            <ul className="list-disc list-outside pl-5 mt-1 space-y-1 text-gray-700">
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-gray-200 pb-1 mb-2">Skills</h2>
        <div className="space-y-2">
            {skills.map((skillCat, index) => (
                <div key={index} className="flex items-start">
                    <p className="font-semibold text-gray-800 w-40 flex-shrink-0">{skillCat.category}:</p>
                    <p className="text-gray-700">{skillCat.items.join(', ')}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Custom Sections */}
      {customSections && customSections.map((section, index) => (
          <div key={index} className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-gray-200 pb-1 mb-2">{section.title}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
          </div>
      ))}

      {/* Education */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-gray-200 pb-1 mb-2">Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <div>
              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-sm text-gray-700">{edu.institution}</p>
            </div>
            <p className="text-xs text-gray-600">{edu.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
