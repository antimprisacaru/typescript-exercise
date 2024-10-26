export const UsersApiRoutes = {
  getCurrentUser: () => `auth/me`,
  postLogin: () => 'auth/login',
  postRegister: () => 'auth/register',
  postLogout: () => 'auth/logout',
} as const;
