import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { API_ENDPOINT, formatSession } from '@shared/index';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { FormattedSession, Schema, ShowroomEvent } from '@models/index';
import { ClientEventViewTable } from '../list/client-events-list.component';

@Component({
  selector: 'app-client-events-detail',
  templateUrl: './client-events-detail.component.html',
  styleUrls: ['./client-events-detail.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
})
export class ClientEventsDetailComponent implements OnInit {
  collection: Schema = 'Event';
  event: ClientEventViewTable | null = null;

  imageFieldPath = '';

  sessions: FormattedSession[] = [];
  @ViewChild(MatTable) table!: MatTable<FormattedSession>;
  displayedColumnsSessions = ['date', 'startTime', 'endTime'];

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state;
    if (routeState) {
      this.event = routeState.event;
      this.populateFields();
    }
  }
  getEvent(eventId: string): Observable<ShowroomEvent> {
    return this.restService.getCollection<ShowroomEvent>(
      this.collection,
      eventId,
    );
  }

  populateFields() {
    this.imageFieldPath = this.event?.imageFieldPath ?? `${API_ENDPOINT}`;
    this.sessions = this.event?.sessions || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id && !this.event) {
      this.getEvent(id).subscribe((event) => {
        this.event = {
          _id: event._id ?? crypto.randomUUID(),
          title: event.title,
          arena: event.showroom ? event.showroom.name : '',
          availability:
            event.showroom && event.tickets
              ? event.showroom.capacity - event.tickets.length
              : 0,
          occupation:
            event.showroom && event.tickets
              ? (event.tickets.length / event.showroom.capacity) * 100
              : 0,
          imageFieldPath: `${API_ENDPOINT}/${event.poster}`,
          description: event.description,
          promoter: event.promoter,
          minimumAge: event.minimumAge,
          salesStartDate: event.saleStartDate,
          salesEndDate: event.saleEndDate,
          address: event.showroom?.address,
          email: event.showroom?.email ?? '',
          tel: event.showroom?.tel ?? '',
          sessions: event.sessions.map(formatSession),
        };
        this.populateFields();
      });
    }
  }
}
