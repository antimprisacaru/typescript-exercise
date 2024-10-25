import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { EnvironmentConfigService } from './env.config';
import * as path from 'path';
import * as SuperTokens from 'supertokens-node';
import { SupertokensConfig } from './supertokens.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, `env/${process.env['NODE_ENV'] || 'development'}.env`),
        path.resolve(__dirname, 'env/.env'),
      ],
      validate: (config: Record<string, unknown>) => envSchema.parse(config),
      isGlobal: true,
      expandVariables: true, // Enables ${} syntax for variable substitution
    }),
  ],
  providers: [EnvironmentConfigService, SupertokensConfig],
  exports: [EnvironmentConfigService],
})
export class ConfigModule implements OnModuleInit {
  constructor(private readonly supertokensConfig: SupertokensConfig) {}

  async onModuleInit() {
    SuperTokens.init(this.supertokensConfig.getConfig());
  }
}
