import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface MessageCreateForm {
  text: FormControl<string>;
}

export function initMessageCreationForm(): FormGroup<MessageCreateForm> {
  return new FormGroup<MessageCreateForm>({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(255)] }),
  });
}
