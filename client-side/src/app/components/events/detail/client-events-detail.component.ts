import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from '@models/events';
import {MatTable } from '@angular/material/table';
import { formatSession } from '@shared/utils';
import { API_ENDPOINT } from '@shared/index'
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-events-detail',
  templateUrl: './client-events-detail.component.html',
  styleUrls: ['./client-events-detail.component.css']
})
export class ClientEventsDetailComponent implements OnInit {
  collection = 'Event';
  title?: string;
  event!: Event;

  imageFieldPath?:string;

  sessions:any[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumnsSessions: string[] = ['date', 'startTime', 'endTime'];

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.event = routeState.event;
      this.populateFields();
    }
  }
  getEvent(eventId: string): Observable<any>{
    return this.restService.getCollection<Event>(this.collection, eventId);
  }

  populateFields(){
    const image = (this.event?.poster as unknown as string);
    this.imageFieldPath = `${API_ENDPOINT}/${image}`;
    this.sessions = this.event?.sessions?.map(formatSession) || []; 
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if(id && !this.event){
      this.getEvent(id).subscribe((event) => {
        this.event = event;
        this.populateFields();
      });
    }
  }
}
