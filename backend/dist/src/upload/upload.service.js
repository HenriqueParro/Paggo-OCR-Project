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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ocr_service_1 = require("../ocr/ocr.service");
let UploadService = class UploadService {
    constructor(prisma, ocrService) {
        this.prisma = prisma;
        this.ocrService = ocrService;
    }
    async saveDocument(userId, fileName, filePath) {
        const document = await this.prisma.document.create({
            data: {
                userId,
                fileName,
                filePath,
                status: 'processing',
            },
        });
        try {
            const extractedText = await this.ocrService.extractText(filePath);
            await this.prisma.extractedText.create({
                data: {
                    documentId: document.id,
                    text: extractedText,
                },
            });
            await this.prisma.document.update({
                where: { id: document.id },
                data: { status: 'completed' },
            });
            return document;
        }
        catch (error) {
            await this.prisma.document.update({
                where: { id: document.id },
                data: { status: 'error' },
            });
            throw new Error('Failed to process uploaded file');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ocr_service_1.OcrService])
], UploadService);
//# sourceMappingURL=upload.service.js.map