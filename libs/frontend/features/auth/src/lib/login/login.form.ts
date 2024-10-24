import { FormControl, FormGroup, Validators } from '@angular/forms';

export type LoginForm = {
  email: FormControl<string>;
  password: FormControl<string>;
};

export function initLoginForm(): FormGroup<LoginForm> {
  return new FormGroup<LoginForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });
}
