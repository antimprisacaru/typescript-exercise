import { Component, inject, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { UserService } from '@typescript-exercise/core/services/user.service';
import { MessageModel } from '../../models/message.model';

@Component({
  selector: 'app-message',
  standalone: true,
  template: `
    @let message = messageInput() ; @let user = currentUser() ;
    <div
      [ngClass]="{
        'flex justify-end': message.sender.id === user.id,
        'flex justify-start': message.sender.id !== user.id
      }"
    >
      <div
        [ngClass]="{
          'bg-indigo-500 text-white': message.sender.id === user.id,
          'bg-gray-200': message.sender.id !== user.id
        }"
        class="rounded-lg px-4 py-2 max-w-xs lg:max-w-md my-2"
      >
        <p class="font-semibold text-xs mb-1">{{ message.sender.firstName }} {{ message.sender.lastName }}</p>
        <p>{{ message.text }}</p>
        <div class="text-xs text-right mt-1">
          {{ message.timestamp | date : 'short' }}
          @if (message.sender.id === user.id) {
          <i class="pi ml-1"></i>
          }
        </div>
      </div>
    </div>
  `,
  imports: [NgClass, DatePipe],
})
export class MessageComponent {
  private readonly userService = inject(UserService);

  protected readonly currentUser = this.userService.currentUser;
  public readonly messageInput = input.required<MessageModel>();
}
