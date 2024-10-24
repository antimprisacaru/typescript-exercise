import { Routes } from '@angular/router';

export const ConversationId = 'conversationId';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat/chat.component').then((c) => c.ChatComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./messages/messages-list/messages-list-empty.component').then((c) => c.ChatEmptyStateComponent),
      },
      {
        path: `:${ConversationId}`,
        loadComponent: () =>
          import('./messages/messages-list/messages-list.component').then((c) => c.MessagesListComponent),
      },
    ],
  },
];
