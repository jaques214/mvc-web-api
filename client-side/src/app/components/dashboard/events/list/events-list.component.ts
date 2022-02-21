import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '@services/rest.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Event } from '@models/events';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { API_ENDPOINT } from '@shared/index'

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
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListEventsComponent implements OnInit {
  title?: string = 'Listagem';
  events: Event[] = [];
  collection = 'Event';
  data$!: Observable<any>;

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = ['title', 'arena', 'availability', 'occupation'];
  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEvents();
    this.table.removeHeaderRowDef;
  }

  onView(event:any) {
    this.router.navigate(['dashboard/events/detail/' + event._id], {
      state: {
        event,
      },
    });
  }

  onDelete(event: any) {
    this.openDialog(event);
  }

  getEvents(): void {
    this.data$ = this.restService
      .getAllCollections<Event>(this.collection)
      .pipe(
        map((events) => {
          //convert strings to Date
          events.forEach((event) => {
            (event as any).arena = event.showroom?.name
            const image = (event?.poster as unknown as string);
            (event as any).imageFieldPath = `${API_ENDPOINT}/${image}`;
            event.sessions?.forEach((session) => {
              session.date = new Date(session.date as any);
            });
            (event as any).availability = event.showroom!.capacity - event.tickets!.length;
            (event as any).occupation = event.tickets!.length / event.showroom!.capacity * 100
          });
          this.dataSource = new MatTableDataSource(events);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.table.renderRows();
          return events;
        })
      );
    this.data$.subscribe();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(event: any) {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: 'auto',
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result &&
        this.restService
          .deleteCollection<Event>(this.collection, result)
          .subscribe({
            next: () => {
              this.getEvents();
            },
            error: (error) => {
              // TODO: error handling
            },
          });
    });
  }

  formatDate(date: Date | undefined): string {
    return date?.toDateString() || '';
  }
}

@Component({
  selector: 'app-confirm-message',
  templateUrl: './confirm-message.component.html',
})
export class ConfirmMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public event: Event
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.event._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
