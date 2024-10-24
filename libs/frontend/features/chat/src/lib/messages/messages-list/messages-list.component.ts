import { Component, computed, inject, Signal } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { MessageComponent } from '../message/message.component';
import { injectParams } from 'ngxtension/inject-params';
import { ConversationId } from '../../chat.routes';
import { derivedFrom } from 'ngxtension/derived-from';
import { catchError, filter, map, Observable, of, pipe, startWith, Subject, switchMap } from 'rxjs';
import { MessageModel } from '../../models/message.model';
import { ChatSkeletonComponent } from '../message/message-skeleton.component';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '@typescript-exercise/core/services/user.service';
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
  imports: [
    MessageComponent,
    ChatSkeletonComponent,
    InputTextModule,
    AvatarModule,
    PrimeTemplate,
    ButtonDirective,
    CreateMessageComponent,
  ],
  template: `
    @let state = messagesState() ; @if (state.loading) {
    <app-chat-skeleton />
    } @else if (state.error) {
    <div class="h-screen flex flex-col items-center justify-center p-4">
      <div class="text-center">
        <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Failed to load messages</h2>
        <p class="text-gray-600 mb-6">There was a problem loading your messages. Please try again.</p>
        <button pButton label="Retry" icon="pi pi-refresh" (click)="retry$.next()" class="p-button-primary"></button>
      </div>
    </div>
    } @else {
    <div class="h-screen flex flex-col">
      <!-- Chat header -->
      <div class="p-4 border-b flex items-center gap-4">
        <p-avatar [image]="participant()?.avatarUrl" size="large">
          <ng-template pTemplate="error">
            {{ participant()?.firstName?.[0] ?? 'user' }}
          </ng-template>
        </p-avatar>

        <div>
          <h2 class="font-bold">{{ participant()?.firstName }} {{ participant()?.lastName }}</h2>
          <p class="text-sm text-gray-500">Active now</p>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4" #messageContainer>
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
            class="rounded-lg p-3 max-w-[70%]"
          >
            {{ message.text }}
          </div>
        </div>
        } }
      </div>

      <!-- Input area -->
      <app-create-message />
    </div>
    }
  `,
})
export class MessagesListComponent {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly conversationId = injectParams(ConversationId);

  protected readonly retry$ = new Subject<void>();

  protected readonly messagesState: Signal<MessagesListState> = derivedFrom(
    [this.conversationId],
    pipe(
      map(([conversationId]) => conversationId),
      filter(Boolean),
      switchMap(
        (id): Observable<MessagesListState> =>
          this.retry$.pipe(
            startWith(undefined),
            switchMap(() =>
              this.messageService.getAllMessages(id).pipe(
                map((result) => ({ data: result, loading: false })),
                startWith({ data: [], loading: true }),
                catchError(() => of({ data: [], loading: false, error: true }))
              )
            )
          )
      ),
      startWith({ loading: true, data: [] })
    )
  );
  protected readonly currentUserId = computed(() => this.userService.currentUser().id);
  // TODO: Pass participant from parent
  protected readonly participant = computed(
    () => this.messagesState().data.find((message) => message.sender.id !== this.currentUserId())?.sender
  );
}
