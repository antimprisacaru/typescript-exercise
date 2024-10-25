import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from '../common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository {
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
