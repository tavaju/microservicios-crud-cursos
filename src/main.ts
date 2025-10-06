import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar CORS
  const corsOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS', 'http://localhost:3000');
  app.enableCors({
    origin: corsOrigins.split(',').map(origin => origin.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Courses Service - Microservices CRUD')
    .setDescription('API para gestión de cursos e inscripciones con Supabase')
    .setVersion('1.0')
    .addTag('courses', 'Gestión de cursos')
    .addTag('enrollments', 'Gestión de inscripciones')
    .addTag('health', 'Health check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT', 4000);
  await app.listen(port);
  
  console.log(`🚀 Courses Service ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
}
bootstrap();
