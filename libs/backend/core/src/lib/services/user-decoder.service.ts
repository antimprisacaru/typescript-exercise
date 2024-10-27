import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserRepository } from '@typescript-exercise/backend/data-access/user/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserDecoderService {
  constructor(private readonly userRepository: UserRepository) {}

  public async decode(session: SessionContainer): Promise<User> {
    const user = await this.userRepository.findBySupertokensId(session.getUserId());
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
