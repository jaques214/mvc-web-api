import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-shared-time-form',
  templateUrl: './shared-time-form.component.html',
  styleUrls: ['./shared-time-form.component.css']
})
export class SharedTimeFormComponent implements OnInit {
  @Input() timeFields!:any
  @Input() range = false;

  constructor() { }

  ngOnInit(): void {}
}
