import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-core',
  standalone: true,
  template: `
    <div class="flex flex-col h-screen">
      <div class="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Messenger</h1>
        <button class="p-2 rounded-full hover:bg-indigo-700">
          <i class="pi pi-user text-2xl"></i>
        </button>
      </div>
      <div class="flex-1 overflow-hidden">
        <router-outlet />
      </div>
    </div>
  `,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreComponent {}
