import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '@services/rest.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import type {
  ShowroomEvent,
  Schema,
  FormattedSession,
  Address,
} from '@models/index';

export interface EventViewTable {
  _id: string;
  title: string;
  arena: string;
  availability: number;
  occupation: number;
  imageFieldPath?: string;
  price: number;
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
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
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
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class ListEventsComponent implements OnInit {
  title?: string = 'Listagem';
  events: EventViewTable[] = [];
  collection: Schema = 'Event';
  data$!: Observable<EventViewTable[]>;

  @ViewChild(MatTable) table!: MatTable<EventViewTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = ['title', 'arena', 'availability', 'occupation'];
  dataSource = new MatTableDataSource<EventViewTable>([]);
  expandedElement: EventViewTable | null = null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  onView(event: EventViewTable) {
    this.router.navigate(['dashboard/events/detail/' + event._id], {
      state: {
        event,
      },
    });
  }

  onDelete(event: EventViewTable) {
    this.openDialog(event);
  }

  getEvents(): void {
    this.data$ = this.restService
      .getAllCollections<ShowroomEvent>(this.collection)
      .pipe(
        map((events: ShowroomEvent[]) =>
          events.map((event) => ({
            _id: event._id ?? crypto.randomUUID(),
            title: event.title,
            arena: event.showroom ? event.showroom.name : '',
            availability: event.showroom
              ? event.showroom.capacity - event.tickets!.length
              : 0,
            occupation: event.showroom
              ? (event.tickets!.length / event.showroom.capacity) * 100
              : 0,
            imageFieldPath: `${API_ENDPOINT}/${event.poster}`,
            price: event.price,
            description: event.description,
            promoter: event.promoter,
            minimumAge: event.minimumAge,
            salesStartDate: event.saleStartDate,
            salesEndDate: event.saleEndDate,
            address: event.showroom?.address,
            email: event.showroom?.email ?? "",
            tel: event.showroom?.tel ?? "",
            sessions: event.sessions.map(formatSession),
          })),
        ),
        tap((events: EventViewTable[]) => {
          this.dataSource = new MatTableDataSource(events);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.table.renderRows();
        }),
      );
    this.data$.subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(event: EventViewTable) {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: 'auto',
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result &&
        this.restService
          .deleteCollection<ShowroomEvent>(this.collection, result)
          .subscribe({
            next: () => {
              this.getEvents();
            },
            error: (error) => {
              // TODO: error handling
              console.error('Error deleting event:', error);
            },
          });
    });
  }
}

@Component({
  selector: 'app-confirm-message',
  templateUrl: './confirm-message.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public event: ShowroomEvent,
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.event._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
