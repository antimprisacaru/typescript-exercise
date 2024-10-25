import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CreateMessageComponent } from '../messages/message-create/message-create.component';
import { MessagesListComponent } from '../messages/messages-list/messages-list.component';
import { ConversationsService } from '../services/conversations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PrimeTemplate } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ResponsiveService } from '@typescript-exercise/frontend/core/services/responsive.service';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MessagesListComponent,
    CreateMessageComponent,
    NgClass,
    DatePipe,
    RouterOutlet,
    RouterLinkActive,
    AvatarModule,
    PrimeTemplate,
    RouterLink,
    SkeletonModule,
    DividerModule,
  ],
  template: `
    <div class="flex h-screen">
      <!-- Sidebar -->
      @if (!responsive.isMobile() || (responsive.isMobile() && showSidebar())) {
      <div
        [class.w-96]="!responsive.isMobile()"
        [class.w-full]="responsive.isMobile()"
        class="border-r border-gray-200 flex flex-col"
      >
        <div class="p-4 border-b">
          <h1 class="text-2xl font-bold">Messages</h1>
        </div>

        <div class="flex-1 overflow-y-auto">
          @for (conversation of conversations(); track conversation.id) {
          <div
            [routerLink]="['/chat', conversation.id]"
            class="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
            routerLinkActive="bg-gray-100"
            (click)="onConversationSelect()"
          >
            <p-avatar [image]="conversation.participants[0].avatarUrl" size="large" shape="circle">
              @if (conversation.participants[0].avatarUrl) {
              <ng-template pTemplate="error">
                {{ conversation.participants[0].firstName[0] }}
              </ng-template>
              }
            </p-avatar>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="font-semibold truncate">
                  {{ conversation.participants[0].firstName }}
                  {{ conversation.participants[0].lastName }}
                </h3>
                <span class="text-sm text-gray-500">{{ conversation.lastTimestamp | date : 'h:mm a' }}</span>
              </div>
              <p class="text-gray-600 truncate">{{ conversation.lastMessage }}</p>
            </div>
          </div>
          } @empty {
          <div class="p-4">
            <p-skeleton height="60px" className="mb-2"></p-skeleton>
            <p-skeleton height="60px" className="mb-2"></p-skeleton>
            <p-skeleton height="60px" className="mb-2"></p-skeleton>
          </div>
          }
        </div>
      </div>
      }

      <!-- Main chat area -->
      <div class="flex-1" [class.hidden]="responsive.isMobile() && showSidebar()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  private readonly conversationsService = inject(ConversationsService);

  protected readonly conversations = toSignal(this.conversationsService.getConversations(), { initialValue: [] });

  /*** Responsiveness ***/
  protected readonly responsive = inject(ResponsiveService);
  protected readonly showSidebar = signal(false);

  protected onConversationSelect(): void {
    if (this.responsive.isMobile()) {
      this.showSidebar.set(false);
    }
  }
}
