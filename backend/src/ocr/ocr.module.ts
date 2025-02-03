import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Module({
  providers: [OcrService],  // Disponibiliza o serviço
  exports: [OcrService],    // Permite que outros módulos usem o OcrService
})
export class OcrModule {}
