import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule } from '@typescript-exercise/backend/core/config/config.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DataAccessModule } from '@typescript-exercise/backend/data-access/data-access.module';
import { OgmaModule } from '@ogma/nestjs-module';
import { SupertokensService } from './services/supertokens.service';
import { SupertokensConfig } from './config/supertokens.config';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      imports: [ConfigModule, DataAccessModule, OgmaModule.forFeatures([AuthService.name])],
      controllers: [AuthController],
      providers: [SupertokensConfig, SupertokensService, AuthService],
      module: AuthModule,
    };
  }
}
