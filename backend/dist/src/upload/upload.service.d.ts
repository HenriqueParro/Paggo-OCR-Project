import { PrismaService } from 'prisma/prisma.service';
import { Document } from '@prisma/client';
import { OcrService } from '../ocr/ocr.service';
export declare class UploadService {
    private readonly prisma;
    private readonly ocrService;
    constructor(prisma: PrismaService, ocrService: OcrService);
    saveDocument(userId: number, fileName: string, filePath: string): Promise<Document>;
}
