
import React, { useState, useCallback, useEffect } from 'react';
import { InfoPanel } from './components/InfoPanel';
import { InputForm } from './components/InputForm';
import { VerificationResult } from './components/VerificationResult';
import { analyzeWork } from './services/analyzeWork';
import type { NotaryReport, Artifact } from './types';
import * as pdfjsLib from 'pdfjs-dist';
import { Footer } from './components/Footer';

// Set workerSrc for pdf.js
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@^4.4.168/build/pdf.worker.mjs`;

const Logo = () => (
    <h1 className="text-6xl font-serif text-brand-light" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
        VerifAI
    </h1>
);

export default function App(): React.ReactElement {
  const [chatHistory, setChatHistory] = useState<string>('');
  const [artifactFile, setArtifactFile] = useState<File | null>(null);
  const [artifactType, setArtifactType] = useState<'text' | 'image' | 'pdf'>('text');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NotaryReport | null>(null);

  const handleFileChange = (file: File | null) => {
    setArtifactFile(file);
  };
  
  const handleArtifactTypeChange = (type: 'text' | 'image' | 'pdf') => {
    setArtifactType(type);
    setArtifactFile(null); // Clear file when type changes
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const fileToText = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
      });
  };

  const pdfToText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(s => (s as any).str).join(' ');
    }
    return textContent;
  };

  const handleSubmit = useCallback(async () => {
    if (!artifactFile) {
      setError('Please upload a final artifact file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        let llmArtifact: Artifact;
        let notaryArtifact: Artifact;
        
        if (artifactType === 'pdf') {
             const [base64Content, textContent] = await Promise.all([
                fileToBase64(artifactFile),
                pdfToText(artifactFile)
            ]);
            notaryArtifact = { mimeType: artifactFile.type, data: base64Content, encoding: 'base64' };
            llmArtifact = { mimeType: 'text/plain', data: textContent, encoding: 'text' };
        } else if (artifactType === 'text') {
            const textContent = await fileToText(artifactFile);
            llmArtifact = notaryArtifact = { mimeType: artifactFile.type || 'text/plain', data: textContent, encoding: 'text' };
        } else { // image
            const base64Content = await fileToBase64(artifactFile);
            llmArtifact = notaryArtifact = { mimeType: artifactFile.type, data: base64Content, encoding: 'base64' };
        }
        
        const analysisResult = await analyzeWork(notaryArtifact, llmArtifact, chatHistory);
        setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  }, [artifactFile, chatHistory, artifactType]);

  const handleReset = () => {
    setResult(null);
    setError(null);
    setChatHistory('');
    setArtifactFile(null);
    setArtifactType('text');
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <Logo />
          <p className="text-lg text-brand-secondary mt-2">
            Generate a verifiable certificate of human agency for any work you create with AI.
          </p>
        </header>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
            <div className="dot-spinner mb-8">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
            <p className="text-xl text-white">Analyzing your work...</p>
            <p className="text-brand-secondary mt-2">This may take a moment.</p>
          </div>
        )}

        {result ? (
          <VerificationResult result={result} onReset={handleReset} />
        ) : (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoPanel />
            <InputForm
              chatHistory={chatHistory}
              onChatHistoryChange={setChatHistory}
              artifactFile={artifactFile}
              onFileChange={handleFileChange}
              artifactType={artifactType}
              onArtifactTypeChange={handleArtifactTypeChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </main>
        )}
        <Footer />
      </div>
    </div>
  );
}