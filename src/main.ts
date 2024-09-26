// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as express from 'express';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   app.enableCors();

//   //Added this to Increase Request Payload Size Limit
//   app.use(express.json({ limit: '50mb' }));
//   app.use(express.urlencoded({ limit: '50mb', extended: true }));
//   const config = new DocumentBuilder()
//     .setTitle('DABS')
//     .setDescription('easy appointment')
//     .setVersion('1.0')
//     .addTag('dabs')
//     .setExternalDoc('Postman Collection', '/docs-json')
//     .addBearerAuth(undefined, 'ApiKeyAuth')
//     .addSecurityRequirements('ApiKeyAuth')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('docs', app, document, {
//     swaggerOptions: {
//       persistAuthorization: true,
//     },
//   });
//   console.log(process.env.NEST_PORT);
//   await app.listen(process.env.NEST_PORT || 5000);
// }
// bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Added this to increase Request Payload Size Limit
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Apply RolesGuard globally
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('DABS')
    .setDescription('easy appointment')
    .setVersion('1.0')
    .addTag('dabs')
    .setExternalDoc('Postman Collection', '/docs-json')
    .addBearerAuth(undefined, 'ApiKeyAuth')
    .addSecurityRequirements('ApiKeyAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.log(process.env.NEST_PORT);
  await app.listen(process.env.NEST_PORT || 5000);
}
bootstrap();
