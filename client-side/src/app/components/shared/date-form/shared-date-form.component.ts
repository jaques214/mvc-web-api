import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-shared-date-form',
    templateUrl: './shared-date-form.component.html',
    styleUrls: ['./shared-date-form.component.css'],
    imports: [MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
})
export class SharedDateFormComponent {
  @Input() dateFields!: { label: string; name: string; inputs?: { name: string; placeholder?: string }[] };
  @Input() form!: FormGroup;
  @Input() range = false;
}
