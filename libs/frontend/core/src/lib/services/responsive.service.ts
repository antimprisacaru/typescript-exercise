import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  public readonly isMobile$ = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((result) => result.matches));
  public readonly isMobile = toSignal(this.isMobile$, { requireSync: true });
}
