import { UserDto } from '@typescript-exercise/data-access/users/users-api.interfaces';

export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;

  constructor({ id, firstName, lastName, avatarUrl }: UserDto) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatarUrl = avatarUrl;
  }
}
