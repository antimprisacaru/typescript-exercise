import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: `
    <p-toast />
    <router-outlet />
  `,
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService],
})
export class AppComponent {}
