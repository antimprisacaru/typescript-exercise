import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(@OgmaLogger(AuthService) private readonly logger: OgmaService, private readonly userRepository: UserRepository) {}

  async register(req: Request, res: Response, dto: RegisterRequestDto) {
    this.logger.info(`Creating user with email ${dto.email} in the supertokens DB...`);
    const signUpResponse = await EmailPassword.signUp('public', dto.email, dto.password);

    if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      this.logger.error(AuthErrorCode.EMAIL_EXISTS);
      throw new EmailExistsError({ email: dto.email });
    }

    if (signUpResponse.status === 'OK') {
      try {
        this.logger.info(`Creating user with email ${dto.email} in the repository...`);
        const user = await this.userRepository.create({
          data: {
            supertokensId: signUpResponse.user.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });

        await Session.createNewSession(req, res, 'public', new RecipeUserId(signUpResponse.user.id));

        return user;
      } catch (error) {
        this.logger.error(error);
        throw new UserCreationError(error, { email: dto.email });
      }
    }

    this.logger.error(AuthErrorCode.USER_CREATION_FAILED);
    throw new UserCreationError(new Error('Unexpected signup response'));
  }

  async login(req: Request, res: Response, dto: LoginRequestDto) {
    this.logger.info(`Signing in user with email ${dto.email}...`);
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

  async logout(req: Request, res: Response): Promise<void> {
    const session = await this.getSession(req, res);
    if (session) {
      await session.revokeSession();
    }
  }
}
