import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './user/user.repository';

@Module({
  controllers: [],
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class DataAccessModule {}
