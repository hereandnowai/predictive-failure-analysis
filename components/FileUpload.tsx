
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-in-out
                  ${dragActive ? "border-[var(--hnai-text-accent)] bg-[var(--hnai-secondary)] scale-105" : "border-[var(--hnai-border-color)] hover:border-[var(--hnai-text-accent)]"}
                  ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />
      <label htmlFor="file-upload" className={`flex flex-col items-center justify-center ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
        <UploadIcon className="w-12 h-12 text-[var(--hnai-text-accent)] mb-4" />
        <p className="text-lg font-medium text-[var(--hnai-text-on-secondary)]">
          {dragActive ? "Drop the file here..." : "Drag & drop your CSV file here, or click to select"}
        </p>
        <p className="text-xs text-[var(--hnai-text-muted)] mt-1">Supported format: .csv</p>
        {isLoading && <p className="text-[var(--hnai-text-accent)] mt-2">Uploading...</p>}
      </label>
    </div>
  );
};