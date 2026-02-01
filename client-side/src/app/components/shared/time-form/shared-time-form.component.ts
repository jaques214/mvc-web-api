import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-shared-time-form',
    templateUrl: './shared-time-form.component.html',
    styleUrls: ['./shared-time-form.component.css'],
    imports: [CommonModule, MatFormFieldModule, MatIconModule, FormsModule],
})
export class SharedTimeFormComponent implements OnInit {
  @Input() timeFields!:any
  @Input() range = false;

  constructor() { }

  ngOnInit(): void {}
}
