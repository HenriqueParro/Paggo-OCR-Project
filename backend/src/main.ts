import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Habilitar CORS para permitir requisições do frontend
    app.enableCors({
      origin: 'http://localhost:3001', // Permitir o frontend acessar o backend
      credentials: true,
    });
  
  await app.listen(3000);
  

 // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


