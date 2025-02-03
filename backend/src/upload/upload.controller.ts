import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Delete,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { File as MulterFile } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Response } from 'express';



@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Diretório para salvar os arquivos
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Invalid file type. Only JPEG and PNG are allowed.'),
            false,
          );
        }
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId; // Recupera o ID do usuário autenticado
    const fileName = file.filename;
    const filePath = file.path;

    // Salvar metadados no banco de dados
    const document = await this.uploadService.saveDocument(
      userId,
      fileName,
      filePath,
    );

    return {
      message: 'File uploaded successfully!',
      document,
    };
  }

  @Get('download/:documentId')
  @UseGuards(JwtAuthGuard)
  async downloadDocument(
    @Param('documentId') documentId: string,  // Corrigido para string
    @Request() req,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;

    // Converte documentId para número
    const documentIdInt = parseInt(documentId, 10);
    if (isNaN(documentIdInt)) {
      throw new Error('O documentId fornecido não é um número válido.');
    }

    // Verifica se o documento pertence ao usuário
    const document = await this.prisma.document.findFirst({
      where: { id: documentIdInt, userId },
      include: {
        extractedText: true,
        llmInteractions: true,
      },
    });

    if (!document || !document.extractedText) {
      throw new Error('Documento ou texto extraído não encontrado.');
    }

    // Cria o conteúdo para download
    const content = {
      document: {
        fileName: document.fileName,
        extractedText: document.extractedText.text,
      },
      interactions: document.llmInteractions.map((interaction) => ({
        question: interaction.question,
        response: interaction.response,
      })),
    };

    // Define o cabeçalho para download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=document_${documentIdInt}.json`,
    );

    // Envia o conteúdo
    res.send(content);
  }


  @Get('documents')
@UseGuards(JwtAuthGuard)
async getUserDocuments(@Request() req) {
  const userId = req.user.userId;
  return this.prisma.document.findMany({
    where: { userId },
    select: {
      id: true,
      fileName: true,
      status: true,
    },
  });
}

@Get('document/:id')
@UseGuards(JwtAuthGuard)
async getDocumentDetails(@Param('id') id: string, @Request() req) {
  const userId = req.user.userId;
  const document = await this.prisma.document.findFirst({
    where: { id: Number(id), userId },
    include: {
      extractedText: true,
      llmInteractions: true,
    },
  });

  if (!document) {
    throw new Error('Documento não encontrado.');
  }

  return {
    document: {
      fileName: document.fileName,
      extractedText: document.extractedText?.text || 'Texto não disponível',
    },
    interactions: document.llmInteractions.map((interaction) => ({
      question: interaction.question,
      response: interaction.response,
    })),
  };
}


@Delete('delete/:documentId')
@UseGuards(JwtAuthGuard)
async deleteDocument(
  @Param('documentId') documentId: string,
  @Request() req,
) {
  const userId = req.user.userId;

  // Converte documentId para número
  const documentIdInt = parseInt(documentId, 10);
  if (isNaN(documentIdInt)) {
    throw new Error('O documentId fornecido não é um número válido.');
  }

  // Verifica se o documento pertence ao usuário autenticado
  const document = await this.prisma.document.findFirst({
    where: { id: documentIdInt, userId },
  });

  if (!document) {
    throw new Error('Documento não encontrado ou você não tem permissão para deletá-lo.');
  }

  // Exclui os dados relacionados antes de excluir o documento
  await this.prisma.$transaction([
    this.prisma.lLMInteraction.deleteMany({
      where: { documentId: documentIdInt },
    }),
    this.prisma.extractedText.deleteMany({
      where: { documentId: documentIdInt },
    }),
    this.prisma.document.delete({
      where: { id: documentIdInt },
    }),
  ]);

  return { message: 'Documento deletado com sucesso.' };
}


}
