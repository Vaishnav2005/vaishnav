import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { PromptInput } from '../components/PromptInput';
import { ImageDisplay } from '../components/ImageDisplay';
import { Footer } from '../components/Footer';
import { AspectRatioSelector } from '../components/AspectRatioSelector';
import { generateImage } from '../services/geminiService';
import { AspectRatio, HistoryItem, HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from '../types';
import { HistorySidebar } from '../components/HistorySidebar';

interface ImageGeneratorProps {
  onLogout: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onLogout }) => {
  const [prompt, setPrompt] = useState<string>('A photorealistic image of a majestic lion wearing a crown, sitting on a throne in a lush jungle, sunrise');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt, aspectRatio);
      setImageUrl(url);
      const newItem: HistoryItem = {
        id: Date.now(),
        prompt,
        imageUrl: url,
        aspectRatio,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`Failed to generate image. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, aspectRatio, loading]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setImageUrl(item.imageUrl);
    setAspectRatio(item.aspectRatio);
    setError(null);
    setIsHistoryVisible(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header onToggleHistory={() => setIsHistoryVisible(true)} onLogout={onLogout} />
      <HistorySidebar
          isVisible={isHistoryVisible}
          onClose={() => setIsHistoryVisible(false)}
          items={history}
          onSelectItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
        />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          <AspectRatioSelector
            selectedRatio={aspectRatio}
            onChange={setAspectRatio}
            disabled={loading}
          />
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerateImage}
            loading={loading}
          />
          <ImageDisplay
            imageUrl={imageUrl}
            loading={loading}
            error={error}
            aspectRatio={aspectRatio}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};
