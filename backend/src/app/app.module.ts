import { Module } from '@nestjs/common';

import { ConfigModule } from '@typescript-exercise/backend/core/config/config.module';
import { AuthModule } from '@typescript-exercise/backend/features/auth';

@Module({
  imports: [ConfigModule, AuthModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
