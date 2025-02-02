"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../jwt-auth.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("./upload.service");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
let UploadController = class UploadController {
    constructor(uploadService, prisma) {
        this.uploadService = uploadService;
        this.prisma = prisma;
    }
    async uploadImage(file, req) {
        const userId = req.user.userId;
        const fileName = file.filename;
        const filePath = file.path;
        const document = await this.uploadService.saveDocument(userId, fileName, filePath);
        return {
            message: 'File uploaded successfully!',
            document,
        };
    }
    async downloadDocument(documentId, req, res) {
        const userId = req.user.userId;
        const documentIdInt = parseInt(documentId, 10);
        if (isNaN(documentIdInt)) {
            throw new Error('O documentId fornecido não é um número válido.');
        }
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
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=document_${documentIdInt}.json`);
        res.send(content);
    }
    async getUserDocuments(req) {
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
    async getDocumentDetails(id, req) {
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
    async deleteDocument(documentId, req) {
        const userId = req.user.userId;
        const documentIdInt = parseInt(documentId, 10);
        if (isNaN(documentIdInt)) {
            throw new Error('O documentId fornecido não é um número válido.');
        }
        const document = await this.prisma.document.findFirst({
            where: { id: documentIdInt, userId },
        });
        if (!document) {
            throw new Error('Documento não encontrado ou você não tem permissão para deletá-lo.');
        }
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
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                callback(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)('download/:documentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "downloadDocument", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getUserDocuments", null);
__decorate([
    (0, common_1.Get)('document/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getDocumentDetails", null);
__decorate([
    (0, common_1.Delete)('delete/:documentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteDocument", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        prisma_service_1.PrismaService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map