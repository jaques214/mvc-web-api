import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-shared-time-form',
    templateUrl: './shared-time-form.component.html',
    styleUrls: ['./shared-time-form.component.css'],
    imports: [CommonModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatInputModule],
})
export class SharedTimeFormComponent {
  @Input() timeFields!: { label: string; name: string; placeholder?: string; inputs?: { name: string }[] };
  @Input() form!: FormGroup;
  @Input() range = false;
}
