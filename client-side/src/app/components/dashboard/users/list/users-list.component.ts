import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '@services/rest.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '@models/users';
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
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
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
export class ListUsersComponent implements OnInit {
  title?: string = 'Listagem';
  fields: any = User.fields();
  collection = 'User';
  data$!: Observable<any>;
  role$!: Observable<any>;
  role: string = 'Client';

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = ['username', 'permissions'];
  dataSource = new MatTableDataSource<any>([]);
  expandedElement: any | null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.table.removeHeaderRowDef;
  }

  onView(user:any) {
    this.router.navigate(['dashboard/users/detail/' + user._id], {
      state: {
        user,
      },
    });
  }

  onDelete(user: any) {
    this.openDialog(user);
  }

  getUsers(): void {
    this.data$ = this.restService
      .getAllCollections<User>(this.collection)
      .pipe(
        tap((users) => {
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.table.renderRows();
          users.forEach((user:User) => {
            (user as any).permissions = user.role?.value;
          })
        })
      );
    this.data$.subscribe();
  }

  applyFilter(user: any) {
    const filterValue = (user.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(user: any) {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: 'auto',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result &&
        this.restService
          .deleteCollection<User>(this.collection, result)
          .subscribe({
            next: () => {
              this.getUsers();
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
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.user._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
