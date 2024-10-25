import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.schema';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService<EnvConfig>) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL')!;
  }

  get postgresUser(): string {
    return this.configService.get('POSTGRES_USER')!;
  }

  get postgresPassword(): string {
    return this.configService.get('POSTGRES_PASSWORD')!;
  }

  get postgresDb(): string {
    return this.configService.get('POSTGRES_DB')!;
  }

  get postgresPort(): number {
    return this.configService.get('POSTGRES_PORT')!;
  }

  get apiDomain(): string {
    return this.configService.get('API_DOMAIN')!;
  }

  get websiteDomain(): string {
    return this.configService.get('WEBSITE_DOMAIN')!;
  }

  get port(): number {
    return this.configService.get('PORT')!;
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV')!;
  }

  get logLevel(): string {
    return this.configService.get('LOG_LEVEL')!;
  }

  get enableSwagger(): boolean {
    return this.configService.get('ENABLE_SWAGGER')!;
  }

  get corsOrigins(): string[] {
    return this.configService.get('CORS_ORIGINS')!;
  }

  get rateLimitTtl(): number {
    return this.configService.get('RATE_LIMIT_TTL')!;
  }

  get rateLimitMax(): number {
    return this.configService.get('RATE_LIMIT_MAX')!;
  }

  get supertokensConnectionUri(): string {
    return this.configService.get('SUPERTOKENS_CONNECTION_URI')!;
  }

  get supertokensApiKey(): string | undefined {
    return this.configService.get('SUPERTOKENS_API_KEY');
  }
}
