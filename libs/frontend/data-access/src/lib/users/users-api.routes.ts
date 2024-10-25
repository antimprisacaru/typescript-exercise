export const UsersApiRoutes = {
  getCurrentUser: () => `auth/me`,
  postSignIn: () => 'auth/signin',
  postSignUp: () => 'auth/signup',
  postLogout: () => 'auth/logout',
} as const;
