import { useState, useEffect } from 'react';
import { useOCRContext } from '../context/OCRContext';

export const useOCRStatus = () => {
  const { status } = useOCRContext();
  return status;
};