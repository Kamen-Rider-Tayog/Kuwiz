import * as FileSystem from 'expo-file-system/legacy';
import { extractTextFromImage } from './extractors/OcrExtractor';
// Remove: import { extractTextFromPDF } from './extractors/PdfExtractor';
import { extractTextFromDOCX } from './extractors/DocxExtractor';

export const extractTextFromDocument = async (
  fileUri,
  mimeType,
  ocrModel,
  options = {}
) => {
  console.log(`Processing document: ${fileUri}`);
  console.log(`MIME type: ${mimeType}`);

  const { onProgress } = options;

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    if (onProgress) onProgress(0.1);

    let extractedText = '';

    if (mimeType.startsWith('image/')) {
      console.log('Processing as image (OCR)');
      if (onProgress) onProgress(0.2);
      extractedText = await extractTextFromImage(fileUri, ocrModel);
    } else if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      console.log('Processing as DOCX');
      if (onProgress) onProgress(0.2);
      extractedText = await extractTextFromDOCX(fileUri);
    } else if (mimeType === 'application/pdf') {
      // Show a user-friendly message instead of failing
      throw new Error('PDF support is coming soon. For now, please use DOCX or image files.');
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }

    if (onProgress) onProgress(1);
    console.log(
      `Document processed successfully: ${extractedText.length} characters`
    );

    return extractedText.trim();
  } catch (error) {
    console.error('Document processing error:', error);
    throw error;
  }
};

export const isSupportedFileType = (mimeType) => {
  const supportedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return supportedTypes.includes(mimeType);
};

export const getFileTypeDescription = (mimeType) => {
  const descriptions = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/jpg': 'JPEG Image',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Word Document (DOCX)',
  };
  return descriptions[mimeType] || 'Unknown File Type';
};