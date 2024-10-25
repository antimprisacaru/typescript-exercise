import { Injectable } from '@nestjs/common';
import { UserRepository } from '@typescript-exercise/backend/data-access/user/user.repository';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import { Request, Response } from 'express';
import {
  EmailExistsError,
  InvalidCredentialsError,
  UserCreationError,
  UserNotFoundError,
} from '@typescript-exercise/backend/data-access/auth/auth.errors';
import { SignInRequestDto, SignUpRequestDto } from '@typescript-exercise/backend/data-access/auth/auth.dto';
import { RecipeUserId } from 'supertokens-node';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(req: Request, res: Response, dto: SignUpRequestDto) {
    const signUpResponse = await EmailPassword.signUp('public', dto.email, dto.password);

    if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      throw new EmailExistsError({ email: dto.email });
    }

    if (signUpResponse.status === 'OK') {
      try {
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
        throw new UserCreationError(error, { email: dto.email });
      }
    }

    throw new UserCreationError(new Error('Unexpected signup response'));
  }

  async signIn(req: Request, res: Response, dto: SignInRequestDto) {
    const signInResponse = await EmailPassword.signIn('public', dto.email, dto.password);

    if (signInResponse.status === 'WRONG_CREDENTIALS_ERROR') {
      throw new InvalidCredentialsError({ email: dto.email });
    }

    if (signInResponse.status === 'OK') {
      const user = await this.userRepository.findBySupertokensId(signInResponse.user.id);

      if (!user) {
        throw new UserNotFoundError({
          supertokensId: signInResponse.user.id,
          email: dto.email,
        });
      }

      await Session.createNewSession(req, res, 'public', new RecipeUserId(signInResponse.user.id));

      return user;
    }

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
