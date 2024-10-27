import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@typescript-exercise/backend/data-access/user/user.repository';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import { Request, Response } from 'express';
import {
  AuthErrorCode,
  EmailExistsError,
  InvalidCredentialsError,
  UserCreationError,
  UserNotFoundError,
} from '@typescript-exercise/backend/data-access/auth/auth.errors';
import { LoginRequestDto, RegisterRequestDto } from '@typescript-exercise/backend/data-access/auth/auth.dto';
import { RecipeUserId } from 'supertokens-node';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(@OgmaLogger(AuthService) private readonly logger: OgmaService, private readonly userRepository: UserRepository) {}

  async register(dto: RegisterRequestDto): Promise<void> {
    this.logger.info(`Creating user with email ${dto.email} in the supertokens DB...`);
    const signUpResponse = await EmailPassword.signUp('public', dto.email, dto.password);

    if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      this.logger.error(AuthErrorCode.EMAIL_EXISTS);
      throw new EmailExistsError({ email: dto.email });
    }

    if (signUpResponse.status === 'OK') {
      try {
        this.logger.info(`Creating user with email ${dto.email} in the repository...`);
        await this.userRepository.create({
          data: {
            supertokensId: signUpResponse.user.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });

        this.logger.info(`User successfully created.`);
        return;
      } catch (error) {
        this.logger.error(error);
        throw new UserCreationError(error, { email: dto.email });
      }
    }

    this.logger.error(AuthErrorCode.USER_CREATION_FAILED);
    throw new UserCreationError(new Error('Unexpected signup response'));
  }

  async login(req: Request, res: Response, dto: LoginRequestDto) {
    const signInResponse = await EmailPassword.signIn('public', dto.email, dto.password);

    if (signInResponse.status === 'WRONG_CREDENTIALS_ERROR') {
      this.logger.error(AuthErrorCode.INVALID_CREDENTIALS);
      throw new InvalidCredentialsError({ email: dto.email });
    }

    if (signInResponse.status === 'OK') {
      const user = await this.userRepository.findBySupertokensId(signInResponse.user.id);

      if (!user) {
        this.logger.error(AuthErrorCode.USER_NOT_FOUND);
        throw new UserNotFoundError({
          supertokensId: signInResponse.user.id,
          email: dto.email,
        });
      }

      await Session.createNewSession(req, res, 'public', new RecipeUserId(signInResponse.user.id));

      return user;
    }

    this.logger.error(AuthErrorCode.INVALID_CREDENTIALS);
    throw new InvalidCredentialsError();
  }

  async getSession(req: Request, res: Response): Promise<SessionContainer | undefined> {
    return Session.getSession(req, res, {
      sessionRequired: true,
      antiCsrfCheck: true,
    });
  }

  async findBySupertokensId(id: string): Promise<User> {
    const user = await this.userRepository.findBySupertokensId(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async logout(req: Request, res: Response): Promise<void> {
    const session = await this.getSession(req, res);
    if (session) {
      await session.revokeSession();
    }
  }
}
