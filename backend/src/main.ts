import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/express';
import { AppModule } from './app/app.module';
import { GlobalErrorFilter } from '@typescript-exercise/backend/core/filters/error.filter';
import { EnvironmentConfigService } from '@typescript-exercise/backend/core/config/env.config';
import { ConfigModule } from '@typescript-exercise/backend/core/config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configContext = await NestFactory.createApplicationContext(ConfigModule);
  const configService = configContext.get(EnvironmentConfigService);

  // Essential middleware
  app.use(cookieParser());
  app.use(middleware());

  // CORS setup
  app.enableCors({
    origin: process.env.WEBSITE_DOMAIN,
    credentials: true,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
  });

  // Swagger setup
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Global error handling
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalErrorFilter(httpAdapter));

  await app.listen(configService.port);

  console.log(`Application is running on: http://localhost:${configService.port}`);
  console.log(`Swagger documentation: http://localhost:${configService.port}/api`);
}

bootstrap();
