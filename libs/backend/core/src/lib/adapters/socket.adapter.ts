import supertokens from 'supertokens-node';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { EnvironmentConfigService } from '../config/env.config';
import { INestApplication } from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  private readonly configService: EnvironmentConfigService;

  constructor(app: INestApplication) {
    super(app);
    this.configService = app.get(EnvironmentConfigService);
  }

  override createIOServer(port: number, options?: any) {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.configService.corsOrigins,
        credentials: true,
        allowedHeaders: ['content-type', 'authorization', 'front-token', ...supertokens.getAllCORSHeaders()],
      },
    });
  }
}
