import { LlmService } from './llm.service';
import { PrismaService } from 'prisma/prisma.service';
export declare class LlmController {
    private readonly llmService;
    private readonly prisma;
    constructor(llmService: LlmService, prisma: PrismaService);
    askLlama(body: {
        documentId: number;
        question: string;
    }, req: any): Promise<{
        question: string;
        response: string;
    }>;
    listInteractions(documentId: number, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        documentId: number;
        question: string;
        response: string;
    }[]>;
}
