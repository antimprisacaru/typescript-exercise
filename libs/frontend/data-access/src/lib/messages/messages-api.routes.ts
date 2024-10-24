export const MessagesApiRoutes = {
  getMessages: (conversationId?: string) => `messages/${conversationId ?? ':conversationId'}`,
  putMessages: (conversationId?: string) => `messages/${conversationId ?? ':conversationId'}/send`,
} as const;
