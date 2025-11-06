import React, { useState, useCallback } from 'react';
import { SearchCircleIcon } from './icons/SearchCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface InputFormProps {
  chatHistory: string;
  onChatHistoryChange: (value: string) => void;
  artifactFile: File | null;
  onFileChange: (file: File | null) => void;
  artifactType: 'text' | 'image' | 'pdf';
  onArtifactTypeChange: (type: 'text' | 'image' | 'pdf') => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const ArtifactTypeSelector: React.FC<{
  artifactType: 'text' | 'image' | 'pdf';
  onArtifactTypeChange: (type: 'text' | 'image' | 'pdf') => void;
}> = ({ artifactType, onArtifactTypeChange }) => {
  const types = [
    { id: 'text', label: 'Text' },
    { id: 'image', label: 'Image' },
    { id: 'pdf', label: 'PDF' },
  ] as const;

  return (
    <div>
      <label className="block text-sm font-medium text-brand-light mb-2">Artifact Type</label>
      <div className="flex space-x-2 rounded-md bg-brand-dark p-1">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onArtifactTypeChange(type.id)}
            className={`w-full rounded py-2 text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-card focus:ring-brand-primary ${
              artifactType === type.id
                ? 'bg-brand-primary text-white'
                : 'text-brand-secondary hover:bg-brand-card'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({
  chatHistory,
  onChatHistoryChange,
  artifactFile,
  onFileChange,
  artifactType,
  onArtifactTypeChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileChange(null);
  }

  const openFileDialog = useCallback((e: React.MouseEvent) => {
    // Prevent the label's default click behavior which also triggers the input
    e.preventDefault();
    // Programmatically click the hidden file input
    document.getElementById('file-upload')?.click();
  }, []);

  const acceptString = {
    text: 'text/*,.md,.json,.csv',
    image: 'image/jpeg,image/png,image/webp,image/gif,image/avif',
    pdf: 'application/pdf',
  }[artifactType];

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <SearchCircleIcon className="w-7 h-7 text-brand-primary" />
        <h2 className="text-2xl font-semibold text-white ml-3">Verification Input</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="chat-history" className="block text-sm font-medium text-brand-light mb-2">
            Chat History (Optional)
          </label>
          <textarea
            id="chat-history"
            rows={8}
            className="w-full bg-brand-dark border border-brand-border rounded-md p-3 text-brand-light placeholder-brand-secondary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150"
            placeholder="Paste your full conversation here..."
            value={chatHistory}
            onChange={(e) => onChatHistoryChange(e.target.value)}
          ></textarea>
          <p className="text-xs text-brand-secondary mt-2">
            Including the chat history provides evidence of your creative direction.
          </p>
        </div>
        
        <ArtifactTypeSelector artifactType={artifactType} onArtifactTypeChange={onArtifactTypeChange} />

        <div>
          <label className="block text-sm font-medium text-brand-light mb-2">
            Final Artifact (Required)
          </label>
          <label
            htmlFor="file-upload"
            className={`flex justify-center items-center w-full min-h-[8rem] px-6 py-10 border-2 border-brand-border border-dashed rounded-md cursor-pointer transition-colors duration-200 ${
              isDragging ? 'border-brand-primary bg-brand-primary/10' : 'hover:border-brand-secondary'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {artifactFile ? (
                <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-6 w-6 text-brand-green" />
                    <span className="text-brand-light font-medium">{artifactFile.name}</span>
                    <button onClick={handleRemoveFile} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase ml-2 p-1">Remove</button>
                </div>
              ) : (
                <p className="text-sm text-brand-secondary">
                  Drag & drop your file here, or{' '}
                  <span className="font-semibold text-brand-primary cursor-pointer" onClick={openFileDialog}>click to select</span>
                </p>
              )}
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileSelect} accept={acceptString} />
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={onSubmit}
          disabled={isLoading || !artifactFile}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 transition duration-150 disabled:bg-brand-secondary disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Verifying...' : 'Verify My Work'}
        </button>
      </div>
    </div>
  );
};