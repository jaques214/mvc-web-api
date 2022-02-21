import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-shared-field-form',
  templateUrl: './shared-field-form.component.html',
  styleUrls: ['./shared-field-form.component.css']
})
export class SharedFieldFormComponent implements OnInit {
  @Input() input!:any;
  @Input() type?:any;

  constructor() {}

  ngOnInit(): void {
    this.type || (this.type = this.input.type)
  }
}
