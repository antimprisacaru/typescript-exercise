import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import supertokens from 'supertokens-node';
import { AppModule } from './app/app.module';
import { GlobalErrorFilter } from '@typescript-exercise/backend/core/filters/error.filter';
import { EnvironmentConfigService } from '@typescript-exercise/backend/core/config/env.config';
import { OgmaService } from '@ogma/nestjs-module';
import { SupertokensExceptionFilter } from '@typescript-exercise/backend/core/filters/supertokens.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvironmentConfigService);

  // Logger
  const logger = app.get<OgmaService>(OgmaService);
  app.useLogger(logger);

  // Essential middleware
  app.use(cookieParser());

  // CORS setup
  app.enableCors({
    origin: ['http://localhost:4200'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  // Swagger setup
  if (configService.enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Chat API')
      .setDescription('The chat application API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Global error handling
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SupertokensExceptionFilter(), new GlobalErrorFilter(logger, httpAdapter, configService));

  await app.listen(configService.port);

  logger.info(`Application is running on: http://localhost:${configService.port}`);
  if (configService.enableSwagger) {
    logger.info(`Swagger documentation: http://localhost:${configService.port}/swagger`);
  }
}

bootstrap();
