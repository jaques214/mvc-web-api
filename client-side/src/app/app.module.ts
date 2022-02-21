import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GoogleChartsModule } from 'angular-google-charts';

import { LoginComponent } from './components/login/login.component';
import { AppComponent } from './app.component';
import { FormEventsComponent, SessionDialogComponent} from './components/dashboard/events/form/events-form.component';
import { FormShowroomsComponent} from './components/dashboard/showrooms/form/showrooms-form.component';
import { FormUsersComponent} from './components/dashboard/users/form/users-form.component';
import { SharedFieldFormComponent } from './components/shared/form-field/shared-field-form.component';
import { ListEventsComponent, ConfirmMessageComponent } from './components/dashboard/events/list/events-list.component';
import { ListShowroomsComponent } from './components/dashboard/showrooms/list/showrooms-list.component';
import { ListUsersComponent } from './components/dashboard/users/list/users-list.component';
import { ErrorComponent } from './components/error/error.component';
import { SharedDateFormComponent } from './components/shared/date-form/shared-date-form.component';
import { SharedTimeFormComponent } from './components/shared/time-form/shared-time-form.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import {MatStepperModule} from '@angular/material/stepper'; 
import { ClientEventsListComponent } from './components/events/list/client-events-list.component';
import { ClientEventsDetailComponent } from './components/events/detail/client-events-detail.component';
import { DashboardMenuComponent } from './components/dashboard/dashboard-menu/dashboard-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    ListEventsComponent,
    ListShowroomsComponent,
    ListUsersComponent,
    FormEventsComponent,
    FormShowroomsComponent,
    FormUsersComponent,
    LoginComponent,
    ErrorComponent,
    SharedDateFormComponent,
    SharedTimeFormComponent,
    HomeComponent,
    MenuComponent,
    FooterComponent,
    AboutComponent,
    SharedFieldFormComponent,
    SessionDialogComponent,
    ConfirmMessageComponent,
    TicketsComponent,
    ClientEventsListComponent,
    ClientEventsDetailComponent,
    DashboardMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    MatOptionModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
    MatSlideToggleModule,
    AppRoutingModule,
    MatTableModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTabsModule,
    GoogleChartsModule,
    ReactiveFormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
