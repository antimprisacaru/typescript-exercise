import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CreateMessageComponent } from '../messages/message-create/message-create.component';
import { MessagesListComponent } from '../messages/messages-list/messages-list.component';
import { ConversationsService } from '../services/conversations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { PrimeTemplate } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ResponsiveService } from '@typescript-exercise/frontend/core/services/responsive.service';
import { DividerModule } from 'primeng/divider';
import { ConversationId } from '../chat.routes';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { filter, map, switchMap } from 'rxjs';

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
    <div class="flex h-[calc(100vh-64px)]">
      <!-- Conversations List -->
      <div
        [class.w-96]="!responsive.isMobile()"
        [class.w-full]="responsive.isMobile()"
        [class.hidden]="responsive.isMobile() && conversationId()"
        class="border-r border-gray-200 flex flex-col"
      >
        <!-- Mobile-only header with back button when in chat -->
        @if (responsive.isMobile() && conversationId()) {
        <div class="p-4 border-b flex items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-gray-100" routerLink="..">
            <i class="pi pi-arrow-left text-xl"></i>
          </button>
          <span class="font-semibold">Back to conversations</span>
        </div>
        }

        <!-- Conversations list header -->
        <div class="p-4 border-b">
          <h1 class="text-2xl font-bold">Messages</h1>
        </div>

        <!-- Conversations list -->
        <div class="flex-1 overflow-y-auto">
          @for (conversation of conversations(); track conversation.id) {
          <div
            [routerLink]="conversation.id"
            class="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
            routerLinkActive="bg-gray-100"
          >
            <p-avatar [image]="conversation.participant.avatarUrl" size="large" shape="circle">
              @if (conversation.participant.avatarUrl) {
              <ng-template pTemplate="error">
                {{ conversation.participant.firstName[0] }}
              </ng-template>
              }
            </p-avatar>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline">
                <h3 class="font-semibold truncate">
                  {{ conversation.participant.firstName }}
                  {{ conversation.participant.lastName }}
                </h3>
                <span class="text-sm text-gray-500">
                  {{ conversation.lastTimestamp | date : 'h:mm a' }}
                </span>
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

      <!-- Messages Area -->
      <div class="flex-1" [class.hidden]="responsive.isMobile() && !conversationId()">
        <!-- Mobile chat header -->
        @if (responsive.isMobile() && conversationId()) {
        <div class="border-b border-gray-200 p-4 flex items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-gray-100" routerLink="..">
            <i class="pi pi-arrow-left text-xl"></i>
          </button>
          <span class="font-semibold">{{ currentChatName() }}</span>
        </div>
        }

        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  // Utility fn that brings an observable that listens to navigation end events
  private readonly navigationEnd$ = injectNavigationEnd();
  private readonly route = inject(ActivatedRoute);
  private readonly conversationsService = inject(ConversationsService);

  protected readonly conversations = toSignal(this.conversationsService.getConversations(), { initialValue: [] });

  // Getting child's conversationId param in order to conditionally show messages vs chat list on mobile
  protected readonly conversationId = toSignal(
    this.navigationEnd$.pipe(
      map(() => this.route.firstChild),
      // If no firstChild, the stream will stop
      filter(Boolean),
      // If there's a firstChild, it'll switchMap to params then get the one we need
      switchMap((route) => route.params),
      map((params) => params[ConversationId])
    ),
    { initialValue: undefined }
  );

  /*** Responsiveness ***/
  protected readonly responsive = inject(ResponsiveService);

  protected readonly currentChatName = computed(() => {
    const currentId = this.conversationId();
    const conversation = this.conversations().find((c) => c.id === currentId);
    return conversation ? `${conversation.participant.firstName} ${conversation.participant.lastName}` : '';
  });
}
