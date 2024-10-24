import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-message',
  standalone: true,
  providers: [MessageService],
  imports: [ReactiveFormsModule, FormsModule, NgClass, InputTextModule],
  template: `
    <form class="p-4 bg-white border-t" (ngSubmit)="onSubmit()">
      <div class="p-4 border-t">
        <div class="flex gap-2">
          <span class="p-input-icon-right flex-1">
            <i class="pi pi-send cursor-pointer"> </i>
            <input type="text" pInputText class="w-full" placeholder="Type a message..." />
          </span>
        </div>
      </div>
    </form>
  `,
  styles: ``,
})
export class CreateMessageComponent {
  async onSubmit() {
    // this.message.status = 'pending';
    // const res = await fetch('http://127.0.0.1:3000/messages/send', {
    //   method: 'GET',
    //   body: JSON.stringify({ text: this.message.text }),
    // });
    // res.status === 204 ? (this.message.status = 'sent') : (this.message.status = 'failed');
    // await this.messageService.add(this.message);
    // this.message = new MessageModel('', 'draft');
  }
}
