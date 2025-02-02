import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from './upload.service';
import { Response } from 'express';
export declare class UploadController {
    private readonly uploadService;
    private readonly prisma;
    constructor(uploadService: UploadService, prisma: PrismaService);
    uploadImage(file: Express.Multer.File, req: any): Promise<{
        message: string;
        document: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            fileName: string;
            filePath: string;
            status: string;
        };
    }>;
    downloadDocument(documentId: string, req: any, res: Response): Promise<void>;
    getUserDocuments(req: any): Promise<{
        id: number;
        fileName: string;
        status: string;
    }[]>;
    getDocumentDetails(id: string, req: any): Promise<{
        document: {
            fileName: string;
            extractedText: string;
        };
        interactions: {
            question: string;
            response: string;
        }[];
    }>;
    deleteDocument(documentId: string, req: any): Promise<{
        message: string;
    }>;
}
