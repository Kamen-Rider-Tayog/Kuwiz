import { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  extractTextFromDocument,
  isSupportedFileType,
  getFileTypeDescription,
} from '../services/DocumentService';

export const useDocumentImport = (navigation, ocrModel, ocrStatus) => {
  const [processing, setProcessing] = useState(false);

  const importDocument = async () => {
    console.log('Import Document tapped');

    if (processing) {
      Alert.alert('Processing', 'Please wait, still processing...');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        console.log('File selected:', file.name, 'Type:', file.mimeType);

        if (!isSupportedFileType(file.mimeType)) {
          Alert.alert(
            'Unsupported File',
            `File type "${getFileTypeDescription(file.mimeType)}" is not supported. Please use images or DOCX files.`
          );
          return;
        }

        if (file.mimeType.startsWith('image/') && !ocrStatus.isReady) {
          if (ocrStatus.progress < 1) {
            Alert.alert(
              'Downloading OCR Model',
              `Please wait while the OCR model downloads (${Math.round(ocrStatus.progress * 100)}%).`,
              [{ text: 'OK' }]
            );
            return;
          }
          if (ocrStatus.error) {
            Alert.alert('OCR Error', `Failed to load OCR model: ${ocrStatus.error}`);
            return;
          }
        }

        setProcessing(true);

        const extractedText = await extractTextFromDocument(
          file.uri,
          file.mimeType,
          ocrModel,
          {
            onProgress: (progress) => {
              console.log(`Extraction progress: ${Math.round(progress * 100)}%`);
            },
          }
        );

        setProcessing(false);
        console.log('Extracted text length:', extractedText.length);

        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        navigation.navigate('CreateNote', {
          prefillTitle: file.name.replace(/\.[^/.]+$/, ''),
          prefillContent: extractedText,
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setProcessing(false);

      let errorMessage = error.message || 'Failed to process document.';
      
      // User-friendly error messages
      if (errorMessage.includes('PDF')) {
        errorMessage = 'PDF support is coming soon. Please use DOCX or image files for now.';
      } else if (errorMessage.includes('No text')) {
        errorMessage = 'No text could be extracted. Make sure the document contains readable text.';
      }
      
      Alert.alert('Extraction Failed', errorMessage);
    }
  };

  return { processing, importDocument };
};