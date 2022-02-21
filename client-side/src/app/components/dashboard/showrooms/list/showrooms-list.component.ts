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
import { Showroom } from '@models/showrooms';
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

@Component({
  selector: 'app-showrooms-list',
  templateUrl: './showrooms-list.component.html',
  styleUrls: ['./showrooms-list.component.css'],
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
export class ListShowroomsComponent implements OnInit {
  title?: string = 'Listagem';
  showrooms: Showroom[] = [];
  collection = 'Showroom';
  data$!: Observable<any>;

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = ['name', 'capacity'];
  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getShowrooms();
    this.table.removeHeaderRowDef;
  }

  onView(showroom: any) {
    this.router.navigate(['dashboard/showrooms/detail/' + showroom._id], {
      state: {
        showroom,
      },
    });
  }

  onDelete(showroom: any) {
    this.openDialog(showroom);
  }

  getShowrooms(): void {
    this.data$ = this.restService
      .getAllCollections<Showroom>(this.collection)
      .pipe(
        map((showrooms) => {
          this.dataSource = new MatTableDataSource(showrooms);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.table.renderRows();
          return showrooms;
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

  openDialog(showroom: any) {
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
})
export class ConfirmMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public showroom: Showroom
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.showroom._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}