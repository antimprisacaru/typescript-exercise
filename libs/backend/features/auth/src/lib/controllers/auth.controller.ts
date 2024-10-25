import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@typescript-exercise/backend/core/guards/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  AuthResponseDto,
  SignInRequestDto,
  SignUpRequestDto,
} from '@typescript-exercise/backend/data-access/auth/auth.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserRepository } from '@typescript-exercise/backend/data-access/user/user.repository';
import { GetSession } from '@typescript-exercise/backend/core/decorators/session.decorator';
import { ValidationPipe } from '@typescript-exercise/backend/core/pipes/validation.pipe';
import { signInSchema, signUpSchema } from '@typescript-exercise/backend/data-access/auth/auth.schema';
import { AuthErrorCode } from '@typescript-exercise/backend/data-access/auth/auth.errors';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, protected readonly userRepository: UserRepository) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input - check response for detailed validation errors',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  async signUp(
    @Body(new ValidationPipe(signUpSchema, AuthErrorCode.INVALID_INPUT))
    dto: SignUpRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    return this.authService.signUp(req, res, dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: SignInRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input - check response for detailed validation errors',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async signIn(
    @Body(new ValidationPipe(signInSchema, AuthErrorCode.INVALID_INPUT))
    dto: SignInRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    return this.authService.signIn(req, res, dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req, res);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@GetSession() session: SessionContainer) {
    const user = await this.userRepository.findBySupertokensId(session.getUserId());
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
