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

export interface UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
