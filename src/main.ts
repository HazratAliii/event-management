// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const config = new DocumentBuilder()
//     .setTitle('Event management')
//     .setDescription('Event management API description')
//     .setVersion('1.0')
//     // .addTag('Events')
//     .build();
//   const documentFactory = () => SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, documentFactory);

//   await app.listen(process.env.PORT ?? 5000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Event Management')
    .setDescription(
      `Event Management API description.

      WebSocket Server:
      - URL: ws://localhost:5000

      WebSocket Events:
      1. **newEvent**
         - Triggered when a new event is created.
         - Payload:
           {
             id: string,
             name: string,
             description: string,
             date: string (ISO 8601),
             location: string,
             maxAttendees: number,
             attendees: number
           }

      2. **spotsFillingUp**
         - Triggered when event spots are close to full.
         - Payload:
           {
             eventId: string,
             availableSpots: number
           }
      `,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
