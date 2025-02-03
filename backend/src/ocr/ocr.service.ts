import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(filePath: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (info) => console.log(info), 
      });

      return result.data.text; 
    } catch (error) {
      console.error('Error during OCR processing:', error);
      throw new Error('OCR processing failed');
    }
  }
}
