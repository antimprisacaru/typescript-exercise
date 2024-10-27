export const MessagesApiRoutes = {
  getMessages: (conversationId?: string) => `conversations/${conversationId ?? ':conversationId'}/messages`,
  putMessages: (conversationId?: string) => `conversations/${conversationId ?? ':conversationId'}/send`,
} as const;
