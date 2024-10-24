import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-chat-skeleton',
  standalone: true,
  template: `
    <div class="h-screen flex flex-col">
      <div class="p-4 border-b flex items-center gap-4">
        <p-skeleton shape="circle" size="4rem"></p-skeleton>
        <div>
          <p-skeleton width="150px" height="24px"></p-skeleton>
          <p-skeleton width="100px" height="16px"></p-skeleton>
        </div>
      </div>

      <div class="flex-1 p-4">
        @for (i of [1, 2, 3, 4, 5]; track $index) {
        <div class="mb-4">
          <p-skeleton height="60px" [style]="{ 'max-width': '70%' }"></p-skeleton>
        </div>
        }
      </div>

      <div class="p-4 border-t">
        <p-skeleton height="40px"></p-skeleton>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule],
})
export class ChatSkeletonComponent {}
