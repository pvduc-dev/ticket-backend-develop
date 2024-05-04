import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
    }),
  );
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const swaggerDocumentOption = new DocumentBuilder()
    .setTitle('Backend Customer API for Buff Ticket System')
    .setVersion('0.0.1')
    .setDescription(
      'This document describes the backend Customer API for the Buff Ticket system, which provides functionalities for customer interactions within the platform. The API facilitates various actions related to event browsing, ticket purchasing, management, and NFC bracelet integration.',
    )
    .addBearerAuth()
    .build();
  const documentSwagger = SwaggerModule.createDocument(
    app,
    swaggerDocumentOption,
  );
  SwaggerModule.setup('api-docs', app, documentSwagger);

  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
