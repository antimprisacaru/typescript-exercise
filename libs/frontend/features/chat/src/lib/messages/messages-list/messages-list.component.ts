import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, Signal } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MessageComponent } from '../message/message.component';
import { injectParams } from 'ngxtension/inject-params';
import { ConversationId } from '../../chat.routes';
import { derivedFrom } from 'ngxtension/derived-from';
import { filter, map, pipe, startWith, Subject, switchMap } from 'rxjs';
import { MessageModel } from '../../models/message.model';
import { ChatSkeletonComponent } from '../message/message-skeleton.component';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '@typescript-exercise/frontend/core/services/user.service';
import { AvatarModule } from 'primeng/avatar';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { CreateMessageComponent } from '../message-create/message-create.component';

type MessagesListState = {
  data: MessageModel[];
  loading: boolean;
  error?: boolean;
};

@Component({
  selector: 'app-messages-list',
  standalone: true,
  providers: [MessageService],
  imports: [MessageComponent, ChatSkeletonComponent, InputTextModule, AvatarModule, PrimeTemplate, ButtonDirective, CreateMessageComponent],
  template: `
    @let state = messagesState() ; @if (state.loading) {
    <app-chat-skeleton />
    } @else if (state.error) {
    <div class="flex flex-col items-center justify-center p-4">
      <div class="text-center">
        <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Failed to load messages</h2>
        <p class="text-gray-600 mb-6">There was a problem loading your messages. Please try again.</p>
        <button pButton label="Retry" icon="pi pi-refresh" (click)="retry$.next()" class="p-button-primary"></button>
      </div>
    </div>
    } @else {
    <div class="relative h-full">
      <!-- Messages -->
      <div class="absolute inset-0 overflow-y-auto p-4 pb-24">
        @if (state.data.length === 0) {
        <div class="h-full flex items-center justify-center text-center text-gray-500">
          <div>
            <i class="pi pi-comments text-4xl mb-2"></i>
            <p>No messages yet. Start the conversation!</p>
          </div>
        </div>
        } @else { @for (message of state.data; track message.id) {
        <div class="mb-4 flex" [class.justify-end]="message.sender.id === currentUserId()">
          <div
            [class.bg-blue-500]="message.sender.id === currentUserId()"
            [class.text-white]="message.sender.id === currentUserId()"
            [class.bg-gray-100]="message.sender.id !== currentUserId()"
            class="rounded-lg p-3 max-w-[70%] break-words"
          >
            {{ message.text }}
          </div>
        </div>
        } }
      </div>

      <!-- Create message component -->
      <div class="absolute bottom-0 left-0 right-0 bg-white">
        <app-create-message />
      </div>
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesListComponent implements OnDestroy {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly conversationId = injectParams(ConversationId);

  protected readonly retry$ = new Subject<void>();

  protected readonly messagesState: Signal<MessagesListState> = derivedFrom(
    [this.conversationId],
    pipe(
      map(([conversationId]) => conversationId),
      filter(Boolean),
      switchMap((id) =>
        this.messageService.getMessagesState(id, this.retry$).pipe(
          map(
            (state): MessagesListState => ({
              data: state.data,
              loading: state.loading,
              error: state.error !== null,
            })
          ),
          startWith({ loading: true, data: [], error: false })
        )
      )
    )
  );

  protected readonly currentUserId = computed(() => this.userService.currentUser().id);
  // TODO: Pass participant from parent
  protected readonly participant = computed(
    () => this.messagesState().data.find((message) => message.sender.id !== this.currentUserId())?.sender
  );

  ngOnDestroy() {
    const conversationId = this.conversationId();
    if (conversationId) {
      this.messageService.leaveConversation(conversationId);
    }
    this.messageService.dispose();
  }

  constructor() {
    effect(() => {
      const conversationId = this.conversationId();

      if (!conversationId) {
        return;
      }
      this.messageService.markMessagesAsDelivered(conversationId);
    });
  }
}
