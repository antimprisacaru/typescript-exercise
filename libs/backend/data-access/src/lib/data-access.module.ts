import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './user/user.repository';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [OgmaModule.forFeatures([PrismaService.name])],
  providers: [PrismaService, UserRepository],
  exports: [UserRepository],
})
export class DataAccessModule {}
