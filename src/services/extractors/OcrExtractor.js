export const extractTextFromImage = async (imageUri, ocrModel) => {
  console.log('Running OCR on image:', imageUri);

  if (!ocrModel) {
    throw new Error('OCR model not provided');
  }

  if (!ocrModel.isReady) {
    const progress = Math.round(ocrModel.downloadProgress * 100);
    throw new Error(`OCR model not ready. Downloading... ${progress}%`);
  }

  if (ocrModel.error) {
    throw new Error(`OCR model error: ${ocrModel.error}`);
  }

  console.log('OCR model ready, processing image...');
  const detections = await ocrModel.forward(imageUri);

  if (!detections || detections.length === 0) {
    throw new Error('No text detected in image');
  }

  const extractedText = detections.map((d) => d.text).join('\n');
  console.log(
    `OCR extracted ${extractedText.length} characters from ${detections.length} text blocks`
  );

  return extractedText;
};