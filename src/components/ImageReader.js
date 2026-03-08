import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, 'eng');
  return text;
};