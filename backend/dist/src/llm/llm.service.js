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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../../prisma/prisma.service");
let LlmService = class LlmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async askLlama(question, extractedText) {
        try {
            const apiUrl = process.env.LLAMA_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) {
                throw new Error('Chave da API OpenRouter não configurada.');
            }
            const response = await axios_1.default.post(apiUrl, {
                model: "meta-llama/llama-3.2-3b-instruct:free",
                messages: [
                    { role: "system", content: "Você é um assistente útil." },
                    { role: "user", content: `Baseado no seguinte texto: "${extractedText}", responda: "${question}"` }
                ],
                max_tokens: 200,
            }, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.choices?.[0]?.message?.content?.trim() || 'Não foi possível gerar uma resposta.';
        }
        catch (error) {
            console.error('Erro ao chamar o LLM:', error.response?.data || error.message);
            throw new Error('Falha na comunicação com o modelo LLM');
        }
    }
    async saveInteraction(documentId, question, response) {
        return this.prisma.lLMInteraction.create({
            data: {
                documentId,
                question,
                response,
            },
        });
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LlmService);
//# sourceMappingURL=llm.service.js.map