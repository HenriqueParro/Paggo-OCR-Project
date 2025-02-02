
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LlmController } from './llm/llm.controller';
import { LlmService } from './llm/llm.service';
import { OcrService } from './ocr/ocr.service';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from 'prisma/primas.modules'; 
import { OcrModule } from './ocr/ocr.module';
import { AppController } from './app.controller';




@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OcrModule,
    UploadModule,
  ],
  providers: [OcrService, LlmService],
  controllers: [LlmController,AppController],
})
export class AppModule {}
