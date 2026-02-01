import { Component, OnInit, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SharedDateFormComponent } from '../date-form/shared-date-form.component';
import { SharedTimeFormComponent } from '../time-form/shared-time-form.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shared-field-form',
    templateUrl: './shared-field-form.component.html',
    styleUrls: ['./shared-field-form.component.css'],
    imports: [MatFormFieldModule, MatIconModule, SharedDateFormComponent, SharedTimeFormComponent, FormsModule],
})
export class SharedFieldFormComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;

  constructor() {}

  ngOnInit(): void {
    this.type || (this.type = this.input.type)
  }
}
