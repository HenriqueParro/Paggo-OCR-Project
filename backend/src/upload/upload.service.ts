import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Document, ExtractedText } from '@prisma/client';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
  ) {}

  async saveDocument(userId: number, fileName: string, filePath: string): Promise<Document> {
    // Salvar o documento no banco com status "processing"
    const document = await this.prisma.document.create({
      data: {
        userId,
        fileName,
        filePath,
        status: 'processing',
      },
    });

    try {
      // Realizar o processamento OCR
      const extractedText = await this.ocrService.extractText(filePath);

      // Salvar o texto extraído no banco
      await this.prisma.extractedText.create({
        data: {
          documentId: document.id,
          text: extractedText,
        },
      });

      // Atualizar o status do documento para "completed"
      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: 'completed' },
      });

      return document;
    } catch (error) {
      // Atualizar o status do documento para "error" em caso de falha
      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: 'error' },
      });

      throw new Error('Failed to process uploaded file');
    }
  }
}
