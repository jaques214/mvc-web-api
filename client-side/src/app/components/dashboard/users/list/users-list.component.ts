import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '@services/rest.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
import {
  type FieldInput,
  type Schema,
  type User,
  type Role,
  userFields,
} from '@models/index';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

type UserViewTable = {
  _id: string;
  username: string;
  permissions: string;
  name: string;
};

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
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  imports: [
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class ListUsersComponent implements OnInit {
  title = 'Listagem';
  fields: FieldInput[] = userFields();
  collection: Schema = 'User';
  data$!: Observable<UserViewTable[]>;
  role$!: Observable<Role[]>;
  role = 'Client';

  @ViewChild(MatTable) table!: MatTable<UserViewTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay = ['username', 'permissions'];
  dataSource = new MatTableDataSource<UserViewTable>([]);
  expandedElement: UserViewTable | null = null;

  constructor(
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  onView(user: UserViewTable) {
    this.router.navigate(['dashboard/users/detail/' + user._id], {
      state: {
        user,
      },
    });
  }

  onDelete(user: UserViewTable) {
    this.openDialog(user);
  }

  getUsers(): void {
    this.data$ = this.restService.getAllCollections<User>(this.collection).pipe(
      map((users: User[]) =>
        users.map((user) => ({
          _id: user._id ?? crypto.randomUUID(),
          username: user.username,
          permissions: user.role?.value ?? '-',
          name: user.name,
        })),
      ),
      tap((users: UserViewTable[]) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.table.renderRows();
      }),
    );
    this.data$.subscribe({
      error: (error: unknown) => {
        console.error('Failed to load users:', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          localStorage.removeItem('currentUser');
          void this.router.navigate(['/login']);
        }
      },
    });
  }

  applyFilter(user: KeyboardEvent) {
    const filterValue = (user.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(user: UserViewTable) {
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
              console.error('Error deleting user:', error);
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
    @Inject(MAT_DIALOG_DATA) public user: User,
  ) {}

  onDelete(): void {
    this.dialogRef.close(this.user._id);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
