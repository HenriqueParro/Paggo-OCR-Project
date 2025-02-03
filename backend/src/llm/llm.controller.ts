import {
    Controller,
    Post,
    UseGuards,
    Body,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/jwt-auth.guard'; 
  import { LlmService } from './llm.service';
  //import { PrismaService } from 'prisma/prisma.service';
  //import { PrismaService } from '../prisma/prisma.service';
  import { PrismaService } from '../prisma/prisma.service';

  import { Get, Param } from '@nestjs/common';




  @Controller('llm')
  export class LlmController {
    constructor(
      private readonly llmService: LlmService,
      private readonly prisma: PrismaService,
    ) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('ask')
    async askLlama(
      @Body() body: { documentId: number; question: string },
      @Request() req,
    ) {
      const userId = req.user.userId;
  
      // Buscar o texto extraído do documento
      const document = await this.prisma.document.findFirst({
        where: {
          id: body.documentId,
          userId, // Garante que o usuário só pode acessar seus próprios documentos
        },
        include: {
          extractedText: true,
        },
      });
  
      if (!document || !document.extractedText) {
        throw new Error('Documento não encontrado ou sem texto extraído.');
      }
  
      // Enviar a pergunta para o LLM
      const response = await this.llmService.askLlama(body.question, document.extractedText.text);
  
      // Salvar a interação no banco
      await this.llmService.saveInteraction(body.documentId, body.question, response);
  
      return {
        question: body.question,
        response,
      };
    }

    @Get('interactions/:documentId')
    @UseGuards(JwtAuthGuard)
    async listInteractions(
  @Param('documentId') documentId: number,
  @Request() req,
    ) {
  const userId = req.user.userId;

  // Verifica se o documento pertence ao usuário
  const document = await this.prisma.document.findFirst({
    where: { id: documentId, userId },
  });

  if (!document) {
    throw new Error('Documento não encontrado.');
  }

  // Lista todas as interações relacionadas ao documento
  const interactions = await this.prisma.lLMInteraction.findMany({
    where: { documentId },
  });

  return interactions;
}

  }
  
