import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findBySupertokensId(supertokensId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { supertokensId },
    });
  }

  async create(params: { data: Prisma.UserCreateInput; select?: Prisma.UserSelect }): Promise<User> {
    const { data, select } = params;
    return this.prisma.user.create({
      data,
      select,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
