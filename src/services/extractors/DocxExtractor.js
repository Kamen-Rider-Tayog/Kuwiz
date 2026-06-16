import * as FileSystem from 'expo-file-system/legacy';
import mammoth from 'mammoth';

export const extractTextFromDOCX = async (docxUri) => {
  console.log('Extracting text from DOCX:', docxUri);
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(docxUri);
    if (!fileInfo.exists) {
      throw new Error('DOCX file does not exist');
    }
    
    const base64 = await FileSystem.readAsStringAsync(docxUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text found in DOCX file');
    }
    
    console.log(`DOCX extracted ${result.value.length} characters`);
    return result.value;
    
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
};