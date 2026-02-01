import { Component, OnInit, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shared-date-form',
    templateUrl: './shared-date-form.component.html',
    styleUrls: ['./shared-date-form.component.css'],
    imports: [MatFormFieldModule, MatDatepickerModule, MatSlideToggleModule, FormsModule],
})
export class SharedDateFormComponent implements OnInit {
  @Input() dateFields!: any;
  @Input() range = false;

  constructor() { }

  ngOnInit(): void {}

}
