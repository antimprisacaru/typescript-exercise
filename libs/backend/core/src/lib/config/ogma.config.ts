import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from './env.config';
import { OgmaModuleOptions } from '@ogma/nestjs-module';

@Injectable()
export class OgmaModuleConfig {
  constructor(private readonly configService: EnvironmentConfigService) {}

  createModuleConfig(): OgmaModuleOptions {
    return {
      logLevel: this.configService.logLevel,
      color: true,
      application: 'Chat App',
    };
  }
}
