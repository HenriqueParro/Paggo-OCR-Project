import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(filePath: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (info) => console.log(info), // Logs do progresso (opcional)
      });

      return result.data.text; // Retorna o texto extraído
    } catch (error) {
      console.error('Error during OCR processing:', error);
      throw new Error('OCR processing failed');
    }
  }
}
