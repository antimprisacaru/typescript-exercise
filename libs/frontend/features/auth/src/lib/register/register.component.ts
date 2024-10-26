import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { filter, map, of, startWith, Subject, switchMap } from 'rxjs';
import { UserService } from '@typescript-exercise/frontend/core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { initRegisterForm } from './register.form';
import { UserRegisterDto } from '@typescript-exercise/frontend/data-access/users/users-api.interfaces';
import { handleApiError } from '@typescript-exercise/frontend/core/error/api-error.handler';
import { UserErrorMap } from '@typescript-exercise/frontend/data-access/users/user.errors';
import { MessageService } from 'primeng/api';

type SignupState = { loading: boolean; error?: boolean };

@Component({
  standalone: true,
  selector: 'app-signup',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-8 text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p class="text-gray-500">Join us today!</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="submit$.next()" class="p-8 pt-0">
          <div class="flex flex-col gap-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="firstName" class="text-sm font-medium text-gray-700">First Name</label>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-user"></i>
                  <input pInputText id="firstName" formControlName="firstName" placeholder="First name" class="w-full" />
                </span>
                @if (signupForm.controls.firstName.invalid && signupForm.controls.firstName.dirty) {
                <small class="p-error">First name is required</small>
                }
              </div>

              <div class="flex flex-col gap-2">
                <label for="lastName" class="text-sm font-medium text-gray-700">Last Name</label>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-user"></i>
                  <input pInputText id="lastName" formControlName="lastName" placeholder="Last name" class="w-full" />
                </span>
                @if (signupForm.controls.lastName.invalid && signupForm.controls.lastName.dirty) {
                <small class="p-error">Last name is required</small>
                }
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm font-medium text-gray-700">Email address</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-envelope"></i>
                <input pInputText id="email" type="email" formControlName="email" placeholder="Enter your email" class="w-full" />
              </span>
              @if (signupForm.controls.email.invalid && signupForm.controls.email.dirty) { @if
              (signupForm.controls.email.errors?.['required']) {
              <small class="p-error">Email is required</small>
              } @if (signupForm.controls.email.errors?.['email']) {
              <small class="p-error">Please enter a valid email</small>
              } }
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-medium text-gray-700">Password</label>
              <p-password
                id="password"
                formControlName="password"
                [toggleMask]="true"
                [feedback]="true"
                placeholder="Create a password"
                [inputStyle]="{ width: '100%' }"
                styleClass="w-full"
                [strongRegex]="'^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'"
              >
                <ng-template pTemplate="header">
                  <div class="text-base mb-2 font-medium">Pick a password</div>
                </ng-template>
                <ng-template pTemplate="footer">
                  <div class="text-xs text-gray-600">
                    Must contain at least:
                    <ul class="list-disc pl-4 mt-1">
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character</li>
                      <li>8 characters minimum</li>
                    </ul>
                  </div>
                </ng-template>
              </p-password>
              @if (signupForm.controls.password.invalid && signupForm.controls.password.dirty) { @if
              (signupForm.controls.password.errors?.['required']) {
              <small class="p-error">Password is required</small>
              } @if (signupForm.controls.password.errors?.['pattern']) {
              <small class="p-error">Password doesn't meet requirements</small>
              } }
            </div>

            <div class="flex flex-col gap-2">
              <label for="confirmPassword" class="text-sm font-medium text-gray-700">Confirm Password</label>
              <p-password
                id="confirmPassword"
                formControlName="confirmPassword"
                [toggleMask]="true"
                [feedback]="false"
                placeholder="Confirm your password"
                [inputStyle]="{ width: '100%' }"
                styleClass="w-full"
              />
              @if (signupForm.controls.confirmPassword.invalid && signupForm.controls.confirmPassword.dirty) { @if
              (signupForm.controls.confirmPassword.errors?.['required']) {
              <small class="p-error">Please confirm your password</small>
              } @if (signupForm.controls.confirmPassword.errors?.['passwordMismatch']) {
              <small class="p-error">Passwords don't match</small>
              } }
            </div>

            <p-button
              type="submit"
              [disabled]="signupForm.invalid || signupState().loading"
              [loading]="signupState().loading"
              [label]="signupState().loading ? 'Creating account...' : 'Create account'"
              severity="primary"
              class="w-full"
            />

            <div class="text-center text-gray-600">
              Already have an account?
              <a routerLink="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [ReactiveFormsModule, NgClass, ButtonModule, PasswordModule, InputTextModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly submit$ = new Subject<void>();

  protected readonly signupForm = initRegisterForm();

  protected readonly signupState = toSignal<SignupState>(
    this.submit$.pipe(
      filter(() => this.signupForm.valid),
      map(() => this.signupForm.getRawValue()),
      switchMap(({ firstName, lastName, email, password }) => {
        const input: UserRegisterDto = { firstName, lastName, email, password };
        return this.userService.register(input).pipe(
          map(() => {
            this.router.navigateByUrl('/auth/login');
            return { loading: false };
          }),
          handleApiError<UserErrorMap>({
            UNKNOWN_ERROR: (error) => {
              this.messageService.add({
                summary: `An error has occurred, backend response was ${error}!`,
                severity: 'error',
              });
              return of({ loading: false, error: true });
            },
          }),
          startWith({ loading: true })
        );
      }),
      startWith({ loading: false })
    ),
    { requireSync: true }
  );

  constructor(private messageService: MessageService) {}
}
