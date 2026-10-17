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
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import type { Address, Schema, Showroom } from '@models/index';

export interface ShowroomViewTable {
  _id: string;
  name: string;
  capacity: number;
  email: string;
  limit: number;
  tel: string;
  address: Address
}

@Component({
  selector: 'app-showrooms-list',
  templateUrl: './showrooms-list.component.html',
  styleUrls: ['./showrooms-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('expanded', style({ height: '*' })),
      transition('void => expanded', [
        style({ height: '0px' }),
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
      transition('expanded => void', [
        animate(
          '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ height: '0px' }),
        ),
      ]),
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
export class ListShowroomsComponent implements OnInit {
  title?: string = 'Listagem';
  showrooms: Showroom[] = [];
  collection: Schema = 'Showroom';
  data$!: Observable<ShowroomViewTable[]>;

  @ViewChild(MatTable) table!: MatTable<ShowroomViewTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = ['name', 'capacity'];
  dataSource = new MatTableDataSource<ShowroomViewTable>([]);
  expandedElement: ShowroomViewTable | null = null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getShowrooms();
  }

  onView(showroom: ShowroomViewTable) {
    this.router.navigate(['dashboard/showrooms/detail/' + showroom._id], {
      state: {
        showroom,
      },
    });
  }

  onDelete(showroom: ShowroomViewTable) {
    this.openDialog(showroom);
  }

  getShowrooms(): void {
    this.data$ = this.restService
      .getAllCollections<Showroom>(this.collection)
      .pipe(
        map((showrooms: Showroom[]) =>
          showrooms.map((showroom) => ({
            _id: showroom._id,
            name: showroom.name,
            capacity: showroom.capacity,
            email: showroom.email,
            limit: showroom.limit,
            tel: showroom.tel,
            address: showroom.address,
          })),
        ),
        tap((showrooms: ShowroomViewTable[]) => {
          this.dataSource = new MatTableDataSource(showrooms);
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

  openDialog(showroom: ShowroomViewTable) {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: 'auto',
      data: showroom,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result &&
        this.restService
          .deleteCollection<Showroom>(this.collection, result)
          .subscribe({
            next: () => {
              this.getShowrooms();
            },
            error: (error) => {
              // TODO: error handling
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
    @Inject(MAT_DIALOG_DATA) public showroom: Showroom,
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.showroom._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
