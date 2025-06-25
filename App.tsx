
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { processCsvData } from './services/dataProcessor';
import { AssetProcessedData } from './types'; // Corrected import
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [processedData, setProcessedData] = useState<AssetProcessedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProcessedData(null);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        if (text) {
          const data = processCsvData(text);
          setProcessedData(data);
        } else {
          setError("Failed to read file content.");
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Error reading file.");
        setIsLoading(false);
      };
      reader.readAsText(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during processing.");
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--hnai-background)] text-[var(--hnai-text-on-secondary)] flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-[var(--hnai-card-background)] shadow-2xl rounded-xl p-6 md:p-10 mb-8 border border-[var(--hnai-border-color)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--hnai-text-accent)] mb-3">Upload Sensor Data</h2>
          <p className="text-[var(--hnai-text-muted)] mb-6 text-sm md:text-base">
            Upload your equipment sensor data (.csv format) to predict potential system failures.
            The CSV should include: <code>asset_id, timestamp, temperature, vibration_level, pressure, runtime_hours, failure_event (optional), location</code>.
          </p>
          <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center my-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--hnai-text-accent)]"></div>
            <p className="ml-4 text-[var(--hnai-text-accent)] text-lg">Processing data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-700 bg-opacity-80 border border-red-500 text-red-100 px-4 py-3 rounded-lg relative mb-6 shadow-lg" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {processedData && !isLoading && (
          <Dashboard data={processedData} />
        )}
        
        {!processedData && !isLoading && !error && (
          <div className="text-center py-10 bg-[var(--hnai-card-background)] shadow-xl rounded-xl border border-[var(--hnai-border-color)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-[var(--hnai-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-[var(--hnai-text-on-secondary)]">Awaiting Data</h3>
            <p className="mt-1 text-sm text-[var(--hnai-text-muted)]">Upload a CSV file to begin analysis.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;