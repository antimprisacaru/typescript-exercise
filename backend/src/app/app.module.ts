import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@typescript-exercise/backend/core/config/config.module';
import { AuthModule } from '@typescript-exercise/backend/features/auth';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
