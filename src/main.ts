import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Taxi24 API')
    .setDescription('API para gestión de servicios de taxi')
    .setVersion('1.0')
    .addTag('drivers', 'Operaciones con conductores')
    .addTag('passengers', 'Operaciones con pasajeros')
    .addTag('trips', 'Operaciones con viajes')
    .addTag('invoices', 'Operaciones con facturas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
