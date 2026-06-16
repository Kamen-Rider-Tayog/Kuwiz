import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOCR, models, initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';

// Initialize ExecuTorch once
initExecutorch({ resourceFetcher: ExpoResourceFetcher });

const OCRContext = createContext(null);

export const OCRProvider = ({ children }) => {
  // The hook is called here, inside a component
  const ocrModel = useOCR({ model: models.ocr.craft({ language: 'en' }) });
  const [modelStatus, setModelStatus] = useState({
    isReady: false,
    progress: 0,
    error: null,
  });

  useEffect(() => {
    setModelStatus({
      isReady: ocrModel.isReady || false,
      progress: ocrModel.downloadProgress || 0,
      error: ocrModel.error || null,
    });
  }, [ocrModel.isReady, ocrModel.downloadProgress, ocrModel.error]);

  const value = {
    model: ocrModel,
    status: modelStatus,
  };

  return <OCRContext.Provider value={value}>{children}</OCRContext.Provider>;
};

// Custom hook to use the OCR context
export const useOCRContext = () => {
  const context = useContext(OCRContext);
  if (!context) {
    throw new Error('useOCRContext must be used within an OCRProvider');
  }
  return context;
};