import { TicketsComponent } from './components/tickets/tickets.component';
import { DashboardMenuComponent } from './components/dashboard/dashboard-menu/dashboard-menu.component';
import { ClientEventsListComponent } from './components/events/list/client-events-list.component';
import { ListEventsComponent } from './components/dashboard/events/list/events-list.component';
import { FormEventsComponent } from './components/dashboard/events/form/events-form.component';
import { ListShowroomsComponent } from './components/dashboard/showrooms/list/showrooms-list.component';
import { FormShowroomsComponent } from './components/dashboard/showrooms/form/showrooms-form.component';
import { ListUsersComponent } from './components/dashboard/users/list/users-list.component';
import { FormUsersComponent } from './components/dashboard/users/form/users-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AboutComponent } from './components/about/about.component';
import { ClientEventsDetailComponent } from './components/events/detail/client-events-detail.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'events',
        children: [
          {
            path: 'add',
            component: FormEventsComponent,
          },
          {
            path: 'detail/:id',
            component: FormEventsComponent,
          },
          {
            path: '**',
            component: ListEventsComponent
          },
        ]
      },
      {
        path: 'showrooms',
        children: [
          {
            path: 'add',
            component: FormShowroomsComponent,
          },
          {
            path: 'detail/:id',
            component: FormShowroomsComponent,
          },
          {
            path: 'detail/**',
            component: ErrorComponent,
            pathMatch: 'full'
          },
          {
            path: '**',
            component: ListShowroomsComponent
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: 'add',
            component: FormUsersComponent,
          },
          {
            path: 'detail/:id',
            component: FormUsersComponent,
          },
          {
            path: 'detail/**',
            component: ErrorComponent,
            pathMatch: 'full'
          },
          {
            path: '**',
            component: ListUsersComponent
          },
        ],
      },
      {
        path: '**',
        component: DashboardMenuComponent
      },
    ],
  },
  {
    path: 'events',
    children: [
      {
        path: 'detail/:id',
        component: ClientEventsDetailComponent,
      },
      {
        path: '**',
        component: ClientEventsListComponent
      },
    ]
  },
  {
    path: 'ticket',
    component: TicketsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
