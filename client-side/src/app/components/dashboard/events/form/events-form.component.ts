import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Event } from '@models/events';
import {MatTable } from '@angular/material/table';
import { normalizeImageName, calcTime, formatSession, formatDate } from '@shared/utils';
import { API_ENDPOINT } from '@shared/index'
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css']
})
export class FormEventsComponent implements OnInit{
  title?: string;
  event?: Event;
  collection = 'Event';
  formFields:any = Event.fields();

  imageFieldPath?:string;
  imageFieldName?:string;
  fileSelected?: File;

  sessions:any[] = [];

  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumnsSessions: string[] = ['select', 'date', 'startTime', 'endTime'];
  selection = new Set();

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.event = routeState.event;
      this.populateForm()
    }
  }
  getEvent(eventId: string): Observable<any>{
    return this.restService.getCollection<Event>(this.collection, eventId);
  }

  populateForm(){
    //if an event already exists populates the formFields inputs.
    this.formFields.inputs.forEach((input:any) => {
      switch(input.name){
        case 'salesDates':{
          input.inputs.forEach((date:any) => {
            date.model = ((this.event as any)[date.name]) as any;
          });
          break;
        }
        case 'showroom':{
          input.model! = (this.event as any)[input.name!].name;
          break;
        }
        default:{
          input.model! = (this.event as any)[input.name!];
        }
      }
    });
    const image = (this.event?.poster as unknown as string);
    this.imageFieldPath = `${API_ENDPOINT}/${image}`;
    this.imageFieldName = normalizeImageName(image);

    this.sessions = this.event?.sessions?.map(formatSession) || []; 
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if(id && !this.event){
      this.getEvent(id).subscribe((event) => {
        this.event = event;
        this.populateForm();
      });
    }
  }

  // Using Event interface is not possible due to Event model class
  onFileSelected(event: any): void {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  onSubmit(): void {
    const data = this.event || new Event();
    this.formFields.inputs.forEach((input:any) => {
      const name = input.name;
      switch(name){
        case 'salesDates': {
          input.inputs.forEach((date:any) => {
            (data as any)[date.name!] = date.model;
          });
          break;
        }
        default:{
          (data as any)[input.name!] = input.model;
        }
      }
    });
    
    data.poster = this.fileSelected;
    data.sessions = [];
    this.sessions.forEach(session => {
      const timeStart = calcTime(session.startTime);      
      const timeEnd = calcTime(session.endTime);  
      data.sessions?.push({
        date: new Date(session.date),
        startTime: new Date(timeStart),
        endTime: new Date(timeEnd)
      })
    })

    this.event ? this.editEvent(data) : this.addEvent(data);
  }

  addEvent(event: Event): void {
    this.restService.addCollection<Event>(this.collection, event, true).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }

  editEvent(event: Event): void {
    this.restService.updateCollection<Event>(this.collection, event._id, event, true).subscribe({
      next: () => {
        this.getEvent(event._id!).subscribe((event) => {
          this.event = event;
          this.populateForm();
        });
      },
      error: error => {
        // TODO: have error handling 
      }
    });
  }

  onDelete(): void {
   this.restService.deleteCollection<Event>(this.collection, this.event?._id).subscribe({
    next: () => {
      this.router.navigate(['/events']);
    },
    error: error => {
      // TODO: error handling
    }
  });
  }

  addSession() {
    this.selection.clear();
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '320px',
      data: Event.sessionFields()
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.sessions.push({
          date: formatDate(result.inputs[0].model),
          startTime: result.inputs[1].inputs[0].model,
          endTime: result.inputs[1].inputs[1].model,
        })
        this.table.renderRows();
      }
    });
  }

  removeSession(){
    this.sessions = this.sessions.filter(session => {
      return !this.selection.has(session);
    });
    this.selection.clear();
    this.table.renderRows();
  }

  selectionToggle(element:any){
    this.selection.has(element) ? this.selection.delete(element) : this.selection.add(element)
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.has(row) ? 'deselect' : 'select'} element`;
  }
}


@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
})
export class SessionDialogComponent {

  constructor(public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public formFields: any) {}

  onConfirm(): void {
    this.dialogRef.close(this.formFields);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}