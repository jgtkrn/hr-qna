import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  const swagger = new DocumentBuilder()
    .setTitle('Qualtics API Documentation By Amoeba')
    .setDescription('List of endpoint used in qualtics api')
    .setVersion('1.0')
    .addTag('QUALTICS')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/v1/doc', app, document);
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
