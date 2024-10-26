import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { EnvironmentConfigService } from './env.config';
import * as path from 'path';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { OgmaModuleConfig } from './ogma.config';
import { ExpressParser } from '@ogma/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerMiddleware } from '../request-logger.middleware';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, `env/${process.env['NODE_ENV'] || 'development'}.env`), path.resolve(__dirname, 'env/.env')],
      validate: (config: Record<string, unknown>) => envSchema.parse(config),
      isGlobal: true,
      expandVariables: true, // Enables ${} syntax for variable substitution
    }),
    OgmaModule.forRootAsync({
      useClass: OgmaModuleConfig,
      imports: [ConfigModule],
    }),
    OgmaModule.forFeature(RequestLoggerMiddleware.name),
  ],
  providers: [EnvironmentConfigService, ExpressParser, { provide: APP_INTERCEPTOR, useClass: OgmaInterceptor }],
  exports: [EnvironmentConfigService],
})
export class ConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
