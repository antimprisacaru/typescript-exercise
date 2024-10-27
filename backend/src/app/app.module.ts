import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';

import { ConfigModule } from '@typescript-exercise/backend/core/config/config.module';
import { AuthModule } from '@typescript-exercise/backend/features/auth';
import { SeedModule } from '@typescript-exercise/backend/data-access/seed.module';
import { SeedService } from '@typescript-exercise/backend/data-access/common/seed/seed.service';
import { EnvironmentConfigService } from '@typescript-exercise/backend/core/config/env.config';
import { SupertokensMiddleware } from '@typescript-exercise/backend/core/middleware/supertokens.middleware';
import { ChatModule } from '@typescript-exercise/backend/features/chat';

@Module({
  imports: [ConfigModule, AuthModule.forRoot(), SeedModule, ChatModule],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly config: EnvironmentConfigService, private readonly seedService: SeedService) {}

  async onModuleInit() {
    if (this.config.isDevelopment) {
      await this.seedService.seed();
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupertokensMiddleware).forRoutes('*');
  }
}
