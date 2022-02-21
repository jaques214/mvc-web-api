import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-shared-date-form',
  templateUrl: './shared-date-form.component.html',
  styleUrls: ['./shared-date-form.component.css']
})
export class SharedDateFormComponent implements OnInit {
  @Input() dateFields!: any;
  @Input() range = false;

  constructor() { }

  ngOnInit(): void {}

}
