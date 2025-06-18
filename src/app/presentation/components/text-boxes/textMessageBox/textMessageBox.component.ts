import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextMessageBoxInterface } from '../../../../interfaces/textMessageBox.interface';

@Component({
  selector: 'app-text-message-box',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textMessageBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxComponent {
  @ViewChild('promptTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  @Input() placeholder: string = '';
  @Input() disabledCorrections: boolean = false;

  @Output() onMessage = new EventEmitter<TextMessageBoxInterface>();

  public fb = inject(FormBuilder);

  public form = this.fb.group({
    prompt: ['', Validators.required],
    files: [[] as File[]],
  });
  selectedFiles: FileList | null = null;

  handleSelectedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = input.files;
      this.form.patchValue({ files: Array.from(input.files) });
    } else {
      this.clearSelectedFiles();
    }
  }

  clearSelectedFiles() {
    this.selectedFiles = null;
    this.form.patchValue({ files: [] });
  }

  selectedFilesList(): File[] {
    return this.selectedFiles ? Array.from(this.selectedFiles) : [];
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  handleSubmit() {
    if (this.form.valid) {
      this.onMessage.emit({
        ...this.form.value,
        files: this.selectedFilesList(),
      } as TextMessageBoxInterface);
      this.form.reset();
    }
  }

  /* aux */
  autoResize() {
    const textarea = this.textarea.nativeElement;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // set to content height
  }
}
