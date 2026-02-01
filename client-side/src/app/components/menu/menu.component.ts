import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from '@components/login/login.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
})
export class MenuComponent implements OnInit {

  constructor(public dialog: MatDialog, public router: Router) {}

  user:any;

  openDialog(): void {
    this.dialog.open(LoginComponent);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
  }

  username(){
    return this.user ? `Hi ${this.user?.username}!` : "Login";
  }
}
