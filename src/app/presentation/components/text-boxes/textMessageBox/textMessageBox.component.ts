import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-message-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxComponent {
  @Input() placeholder: string = '';
  @Input() disabledCorrections: boolean = false;

  @Output() onMessage = new EventEmitter<string>();

  public fb = inject(FormBuilder);

  public form = this.fb.group({
    prompt: ['', Validators.required],
  });
  public file: File | undefined = undefined;

  handleSelectedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.form.patchValue({ prompt: this.file.name });
    } else {
      this.file = undefined;
      this.form.patchValue({ prompt: '' });
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      const { prompt } = this.form.value;

      this.onMessage.emit(prompt ?? '');
      this.form.reset();
    }
  }
}
