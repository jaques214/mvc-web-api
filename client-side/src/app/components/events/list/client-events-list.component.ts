import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '@services/rest.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { API_ENDPOINT, formatSession } from '@shared/index';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import type { Address, FormattedSession, ShowroomEvent } from '@models/index';

export type ClientEventViewTable = {
  _id: string;
  title: string;
  arena: string;
  availability: number;
  occupation: number;
  imageFieldPath?: string;
  description: string;
  promoter: string;
  minimumAge: number;
  salesStartDate: Date;
  salesEndDate: Date;
  address?: Address;
  email: string;
  tel: string;
  sessions: FormattedSession[];
}

@Component({
  selector: 'app-client-events-list',
  templateUrl: './client-events-list.component.html',
  styleUrls: ['./client-events-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  imports: [
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ClientEventsListComponent implements OnInit {
  title = 'Listagem';
  data$!: Observable<ClientEventViewTable[]>;

  @ViewChild(MatTable) table!: MatTable<ClientEventViewTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay = ['title', 'arena', 'availability', 'occupation'];
  dataSource = new MatTableDataSource<ClientEventViewTable>([]);
  expandedElement: ClientEventViewTable | null = null;

  constructor(
    private restService: RestService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  onView(event: ClientEventViewTable) {
    this.router.navigate(['/events/detail/' + event._id], {
      state: {
        event,
      },
    });
  }

  onBuy(event: ClientEventViewTable) {
    this.router.navigate(['/ticket'], {
      state: {
        event,
      },
    });
  }

  getEvents(): void {
    this.data$ = this.restService
      .getAllCollections<ShowroomEvent>('Event')
      .pipe(
        map((events: ShowroomEvent[]) => {
          const showroomEvents = events.map((event) => ({
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
            email: event.showroom?.email ?? "",
            tel: event.showroom?.tel ?? "",
            sessions: event.sessions.map(formatSession),
          }));

          return showroomEvents;
        }),
        tap((events: ClientEventViewTable[]) => {
          this.dataSource = new MatTableDataSource(events);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.table.renderRows();
        }),
      );
    this.data$.subscribe({
      error: (error) => console.error('Failed to load events:', error),
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
