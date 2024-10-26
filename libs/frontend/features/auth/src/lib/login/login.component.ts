import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { initLoginForm } from './login.form';
import { InputTextModule } from 'primeng/inputtext';
import { filter, map, startWith, Subject, switchMap, tap } from 'rxjs';
import { UserService } from '@typescript-exercise/frontend/core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { handleApiError } from '@typescript-exercise/frontend/core/error/api-error.handler';
import { UserErrorMap } from '@typescript-exercise/frontend/data-access/users/user.errors';

type LoginState = { loading: boolean; error?: string };

@Component({
  standalone: true,
  selector: 'app-login',
  template: ` <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      <div class="p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
        <p class="text-gray-500">Please sign in to continue</p>
      </div>

      @if (loginState().error; as error) {
      <div class="px-8">
        <!-- TODO: Handle with internationalization -->
        <div class="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6">{{ error }}</div>
      </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="submit$.next()" class="p-8 pt-0">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-gray-700">Email address</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope"></i>
              <input pInputText id="email" type="email" formControlName="email" placeholder="Enter your email" class="w-full" />
            </span>
            @if (loginForm.controls.email.invalid && loginForm.controls.email.dirty) { @if (loginForm.controls.email.errors?.['required']) {
            <small class="p-error">Email is required</small>
            } @if (loginForm.controls.email.errors?.['email']) {
            <small class="p-error">Please enter a valid email</small>
            } }
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label for="password" class="text-sm font-medium text-gray-700">Password</label>
              <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>
            <p-password
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="false"
              placeholder="Enter your password"
              [inputStyle]="{ width: '100%' }"
              styleClass="w-full"
            >
              <ng-template pTemplate="header">
                <i class="pi pi-lock"></i>
              </ng-template>
            </p-password>
            @if (loginForm.controls.password.invalid && loginForm.controls.password.dirty) { @if
            (loginForm.controls.password.errors?.['required']) {
            <small class="p-error">Password is required</small>
            } @if (loginForm.controls.password.errors?.['minlength']) {
            <small class="p-error">Password must be at least 6 characters</small>
            } }
          </div>

          <p-button
            type="submit"
            [disabled]="loginForm.invalid || loginState().loading"
            [loading]="loginState().loading"
            [label]="loginState().loading ? 'Signing in...' : 'Sign in'"
            severity="primary"
            class="w-full"
          />

          <div class="text-center text-gray-600">
            Don't have an account?
            <a routerLink="/auth/register" class="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</a>
          </div>
        </div>
      </form>
    </div>
  </div>`,
  imports: [ReactiveFormsModule, NgClass, ButtonModule, PasswordModule, InputTextModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly submit$ = new Subject<void>();

  protected readonly loginForm = initLoginForm();

  protected readonly loginState = toSignal<LoginState>(
    this.submit$.pipe(
      // Only allow the stream to pass through if the form is valid
      filter(() => this.loginForm.valid),
      // Turning it into the raw value (because value is typed as null)
      map(() => this.loginForm.getRawValue()),
      switchMap((input) =>
        // Switching to the login call
        this.userService.login(input).pipe(
          // This case will likely be unnoticed, but was kept for stream consistency & potential delays in re-routing
          map(() => ({ loading: false })),
          // After successful, sending the user to the home page
          tap(() => this.router.navigateByUrl('/')),
          // Emitting a loading true to display on the page
          startWith({ loading: true }),
          // If it errors, our state will then show error true
          handleApiError<UserErrorMap>({
            UNKNOWN_ERROR: (error) => ({ loading: false, error: error.code }),
          })
        )
      ),
      // This is for the stream to emit right away, the default state
      startWith({ loading: false })
    ),
    // We enable this such that toSignal knows that this observable will emit right away
    // Thus, undefined values will not appear (hence requireSync is typed without undefined)
    { requireSync: true }
  );

  constructor() {
    effect(() => console.log(this.loginState()));
  }
}
