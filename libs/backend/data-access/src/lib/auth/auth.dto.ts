import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';

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

export class UserDto {
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

  constructor(input: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatarUrl'>) {
    this.id = input.id;
    this.email = input.email;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.avatarUrl = input.avatarUrl;
  }
}
