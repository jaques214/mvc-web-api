import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Event } from '@models/events';
import {MatTable } from '@angular/material/table';
import { formatSession } from '@shared/utils';
import { API_ENDPOINT } from '@shared/index'
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  event!: Event;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  sessions!:any[]
  @ViewChild(MatTable) table!: MatTable<any>;
  columnsToDisplay: string[] = ['viewValue', 'date', 'startTime', 'endTime'];
  columnsToDisplayHeaders:any = {
    viewValue: 'Option', 
    date: 'Date', 
    startTime: 'Start', 
    endTime: 'End'
  };

  imageFieldPath?:string;
  imageFieldName?:string;
  fileSelected?: File;

  constructor(private _formBuilder: FormBuilder, private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.event = routeState.event;
      this.populateFields();
    }
  }
  populateFields(){
    this.sessions = this.event?.sessions?.map(formatSession) || [];
    this.sessions.forEach((session, index) => {
     (session as any).optionValue = index;
     (session as any).viewValue = 'Session ' + (index + 1) ;
   })
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      session: ['', Validators.required],
      covidTest: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      quantity: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
    this.firstFormGroup.get('covidTest')?.setValue(this.fileSelected?.name)
  }

  onBuy(){
    console.log('form', this.firstFormGroup, this.secondFormGroup);
  }
}
