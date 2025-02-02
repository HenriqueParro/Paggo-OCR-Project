import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return '🚀 Backend está rodando! Acesse os endpoints específicos para usar a API.';
  }
}