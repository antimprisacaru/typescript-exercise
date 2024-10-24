import { UserDto } from './users-api.interfaces';
import { randFirstName, randLastName, randUuid } from '@ngneat/falso';

function generateUserDto(): UserDto {
  return {
    id: randUuid(),
    firstName: randFirstName(),
    lastName: randLastName(),
  };
}

export const users: UserDto[] = Array.from({ length: 10 }).map(generateUserDto);

export const DEFAULT_USER = generateUserDto();
