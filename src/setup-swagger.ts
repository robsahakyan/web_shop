import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  options: { version: string },
): void {
  const documentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API')
    .setVersion(options.version)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('/documentation', app, document);

  console.info(
    'Swagger documentation is running. You can access it bt /documentation url',
  );
}
