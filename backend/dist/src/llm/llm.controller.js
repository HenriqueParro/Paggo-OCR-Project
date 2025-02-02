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
exports.LlmController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../jwt-auth.guard");
const llm_service_1 = require("./llm.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_2 = require("@nestjs/common");
let LlmController = class LlmController {
    constructor(llmService, prisma) {
        this.llmService = llmService;
        this.prisma = prisma;
    }
    async askLlama(body, req) {
        const userId = req.user.userId;
        const document = await this.prisma.document.findFirst({
            where: {
                id: body.documentId,
                userId,
            },
            include: {
                extractedText: true,
            },
        });
        if (!document || !document.extractedText) {
            throw new Error('Documento não encontrado ou sem texto extraído.');
        }
        const response = await this.llmService.askLlama(body.question, document.extractedText.text);
        await this.llmService.saveInteraction(body.documentId, body.question, response);
        return {
            question: body.question,
            response,
        };
    }
    async listInteractions(documentId, req) {
        const userId = req.user.userId;
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, userId },
        });
        if (!document) {
            throw new Error('Documento não encontrado.');
        }
        const interactions = await this.prisma.lLMInteraction.findMany({
            where: { documentId },
        });
        return interactions;
    }
};
exports.LlmController = LlmController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('ask'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LlmController.prototype, "askLlama", null);
__decorate([
    (0, common_2.Get)('interactions/:documentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_2.Param)('documentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LlmController.prototype, "listInteractions", null);
exports.LlmController = LlmController = __decorate([
    (0, common_1.Controller)('llm'),
    __metadata("design:paramtypes", [llm_service_1.LlmService,
        prisma_service_1.PrismaService])
], LlmController);
//# sourceMappingURL=llm.controller.js.map