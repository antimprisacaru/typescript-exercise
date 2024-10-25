import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DataAccessModule } from '@typescript-exercise/backend/data-access/data-access.module';

@Module({
  imports: [ConfigModule.forRoot(), DataAccessModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
