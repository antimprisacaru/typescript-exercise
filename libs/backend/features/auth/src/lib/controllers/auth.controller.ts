import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@typescript-exercise/backend/core/guards/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto, RegisterRequestDto, UserDto } from '@typescript-exercise/backend/data-access/auth/auth.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { GetSession } from '@typescript-exercise/backend/core/decorators/session.decorator';
import { ValidationPipe } from '@typescript-exercise/backend/core/pipes/validation.pipe';
import { signInSchema, signUpSchema } from '@typescript-exercise/backend/data-access/auth/auth.schema';
import { AuthErrorCode } from '@typescript-exercise/backend/data-access/auth/auth.errors';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserDecoderService } from '@typescript-exercise/backend/core/services/user-decoder.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userDecoderService: UserDecoderService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input - check response for detailed validation errors',
  })
  @ApiConflictResponse({
    description: 'Email already exists',
  })
  async register(
    @Body(new ValidationPipe(signUpSchema, AuthErrorCode.INVALID_INPUT))
    dto: RegisterRequestDto
  ): Promise<void> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input - check response for detailed validation errors',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async login(
    @Body(new ValidationPipe(signInSchema, AuthErrorCode.INVALID_INPUT))
    dto: LoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDto> {
    return this.authService.login(req, res, dto).then((result) => new UserDto(result));
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    return await this.authService.logout(req, res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@GetSession() session: SessionContainer): Promise<UserDto> {
    return await this.userDecoderService.decode(session).then((result) => new UserDto(result));
  }
}
