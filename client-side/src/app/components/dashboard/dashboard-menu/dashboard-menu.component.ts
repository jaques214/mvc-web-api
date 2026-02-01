import { User } from '@models/users';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard-menu',
    templateUrl: './dashboard-menu.component.html',
    styleUrls: ['./dashboard-menu.component.css'],
    imports: [MatCardModule, MatButtonModule, RouterModule],
})
export class DashboardMenuComponent implements OnInit {
  user!: User;
  menus = [
    {
      name: ' Events',
      pathToAdd: '/dashboard/events/add',
      pathToList: '/dashboard/events',
    },
    {
      name: 'Showrooms',
      pathToAdd: '/dashboard/showrooms/add',
      pathToList: '/dashboard/showrooms',
    },
  ];
  constructor() {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
    if(this.user.role?.value == 'Admin') {
      this.menus.push({
        name: 'Users',
        pathToAdd: '/dashboard/users/add',
        pathToList: '/dashboard/users',
      }) 
    }
  }
}
