import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'User password (min 8 chars, must contain uppercase, lowercase and number)',
    minLength: 8,
  })
  password!: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    minLength: 1,
    maxLength: 50,
  })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    minLength: 1,
    maxLength: 50,
  })
  lastName!: string;
}

export class LoginRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'User password',
  })
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: '5f7d3e2b-1f9c-4e6a-8a0b-6d1f3c7d8e9a',
    description: 'User unique identifier',
  })
  id!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  lastName!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  avatarUrl?: string | null;
}
