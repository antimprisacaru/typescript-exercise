import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-empty-state',
  standalone: true,
  template: `
    <div class="h-screen flex items-center justify-center">
      <div class="text-center">
        <i class="pi pi-comments text-6xl text-gray-300"></i>
        <h2 class="mt-4 text-xl font-semibold text-gray-600">Select a conversation</h2>
        <p class="text-gray-500">Choose a conversation from the list to start chatting</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatEmptyStateComponent {}
