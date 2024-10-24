export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}
