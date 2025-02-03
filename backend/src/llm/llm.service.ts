import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
//import { PrismaService } from '../prisma/prisma.service';
//import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LlmService {
  constructor(private readonly prisma: PrismaService) {}

  async askLlama(question: string, extractedText: string): Promise<string> {
    try {
      const apiUrl = process.env.LLAMA_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error('Chave da API OpenRouter não configurada.');
      }

      const response = await axios.post(
        apiUrl,
        {
          model: "meta-llama/llama-3.2-3b-instruct:free", // Modelo LLaMA 2 no OpenRouter
          messages: [
            { role: "system", content: "Você é um assistente útil." },
            { role: "user", content: `Baseado no seguinte texto: "${extractedText}", responda: "${question}"` }
          ],
          max_tokens: 200,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices?.[0]?.message?.content?.trim() || 'Não foi possível gerar uma resposta.';
    } catch (error) {
      console.error('Erro ao chamar o LLM:', error.response?.data || error.message);
      throw new Error('Falha na comunicação com o modelo LLM');
    }
  }

  async saveInteraction(documentId: number, question: string, response: string) {
    return this.prisma.lLMInteraction.create({
      data: {
        documentId,
        question,
        response,
      },
    });
  }
}
