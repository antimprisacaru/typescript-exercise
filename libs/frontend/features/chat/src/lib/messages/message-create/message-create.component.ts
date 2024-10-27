import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { initMessageCreationForm } from './message-create.form';
import { ConversationId } from '../../chat.routes';
import { injectParams } from 'ngxtension/inject-params';
import { filter, map, pipe, startWith, Subject, switchMap } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { derivedFrom } from 'ngxtension/derived-from';
import { handleApiError } from '@typescript-exercise/frontend/core/error/api-error.handler';

type MessageState = {
  sending: boolean;
  error?: string;
};

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  template: `
    <form [formGroup]="messageForm" (ngSubmit)="submit$.next()" class="bg-white border-t w-full">
      <div class="p-4">
        @if (messageState().error; as error) {
        <div class="mb-2">
          <div class="bg-red-50 text-red-600 p-2 rounded-lg text-sm">
            {{ error }}
          </div>
        </div>
        }

        <div class="flex gap-2">
          <span class="p-input-icon-right flex-1">
            <i
              class="pi pi-send cursor-pointer"
              [class.text-primary]="messageForm.valid && !messageState().sending"
              [class.opacity-50]="messageState().sending"
            >
            </i>
            <input
              type="text"
              pInputText
              class="w-full"
              placeholder="Type a message..."
              formControlName="text"
              [attr.disabled]="messageState().sending ? '' : null"
            />
          </span>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMessageComponent {
  private readonly messageService = inject(MessageService);
  private readonly conversationId = injectParams(ConversationId);

  protected readonly submit$ = new Subject<void>();

  protected readonly messageForm = initMessageCreationForm();

  protected readonly messageState: Signal<MessageState> = derivedFrom(
    [this.conversationId],
    pipe(
      map(([conversationId]) => conversationId),
      filter(Boolean),
      switchMap((conversationId) =>
        this.submit$.pipe(
          filter(() => this.messageForm.valid),
          map(() => ({
            text: this.messageForm.getRawValue().text.trim(),
          })),
          switchMap((input) =>
            this.messageService.addMessage(conversationId, input).pipe(
              map(() => {
                this.messageForm.reset();
                return { sending: false };
              }),
              startWith({ sending: true }),
              handleApiError({
                UNKNOWN_ERROR: (error) => ({
                  sending: false,
                  error: error.message,
                }),
              })
            )
          ),
          startWith({ sending: false })
        )
      )
    )
  );
}
