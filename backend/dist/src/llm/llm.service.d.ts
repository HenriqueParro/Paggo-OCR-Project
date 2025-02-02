import { PrismaService } from 'prisma/prisma.service';
export declare class LlmService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    askLlama(question: string, extractedText: string): Promise<string>;
    saveInteraction(documentId: number, question: string, response: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        documentId: number;
        question: string;
        response: string;
    }>;
}
