import { Component, OnInit, Inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  normalizeImageName,
  calcTime,
  formatSession,
  API_ENDPOINT,
} from '@shared/index';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SharedFieldFormComponent } from '@components/shared/form-field/shared-field-form.component';
import {
  type FieldInput,
  FormattedSession,
  type Schema,
  type Showroom,
  type ShowroomEvent,
  eventFields,
  sessionFields,
} from '@models/index';
import { EventViewTable } from '../list/events-list.component';
import { WeatherWidgetComponent } from '@components/weather-widget/weather-widget.component';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css'],
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    SharedFieldFormComponent,
    MatTableModule,
    ReactiveFormsModule,
    WeatherWidgetComponent
],
})
export class FormEventsComponent implements OnInit {
  title = 'New Event';
  event: EventViewTable | null = null;
  collection: Schema = 'Event';
  formFields: FieldInput[] = eventFields();
  eventForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    price: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true }),
    showroom: new FormControl('', { nonNullable: true }),
    promoter: new FormControl('', { nonNullable: true }),
    minimumAge: new FormControl<number | null>(null),
    saleStartDate: new FormControl<Date | null>(null),
    saleEndDate: new FormControl<Date | null>(null),
  });

  imageFieldPath = '';
  imageFieldName = '';
  fileSelected?: File;

  sessions: FormattedSession[] = [];

  readonly table = viewChild.required(MatTable);
  displayedColumnsSessions: string[] = [
    'select',
    'date',
    'startTime',
    'endTime',
  ];
  selection = new Set<FormattedSession>();

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state;
    if (routeState) {
      this.event = routeState.event;
      this.populateForm();
    }
  }
  getEvent(eventId: string): Observable<ShowroomEvent> {
    return this.restService.getCollection<ShowroomEvent>(
      this.collection,
      eventId,
    );
  }

  populateForm() {
    this.eventForm.patchValue({
      title: this.event?.title ?? '',
      price: this.event?.price ?? null,
      description: this.event?.description ?? '',
      showroom: this.event?.arena,
      promoter: this.event?.promoter ?? '',
      minimumAge: this.event?.minimumAge ?? 18,
      saleStartDate: this.event?.salesStartDate
        ? this.event.salesStartDate
        : null,
      saleEndDate: this.event?.salesEndDate ? this.event.salesEndDate : null,
    });
    this.imageFieldPath = this.event?.imageFieldPath ?? `${API_ENDPOINT}`;
    this.imageFieldName = normalizeImageName(
      this.imageFieldPath.split('/').at(-1) ?? '',
    );

    this.sessions = this.event?.sessions || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id && !this.event) {
      this.getEvent(id).subscribe((event) => {
        this.event = {
          _id: event._id!,
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
          email: event.showroom?.email ?? '',
          tel: event.showroom?.tel ?? '',
          sessions: event.sessions.map(formatSession),
        };
        this.populateForm();
      });
    }
  }

  onFileSelected(event: Event): void {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const values = this.eventForm.getRawValue();
    const data: ShowroomEvent = {
      ...this.event,
      poster: this.fileSelected,
      title: values.title,
      price: values.price ?? 0.0,
      description: values.description,
      showroom: values.showroom
        ? ({
            name: values.showroom,
            email: this.event?.email ?? '',
            tel: this.event?.tel,
            address: this.event?.address,
          } as Showroom)
        : undefined,
      promoter: values.promoter,
      minimumAge: values.minimumAge ?? 18,
      saleStartDate: values.saleStartDate ?? new Date(),
      saleEndDate: values.saleEndDate ?? new Date(),
      sessions: [],
    };

    this.sessions.forEach((session) => {
      const timeStart = calcTime(session.startTime);
      const timeEnd = calcTime(session.endTime);
      data.sessions?.push({
        date: new Date(session.date),
        startTime: new Date(timeStart),
        endTime: new Date(timeEnd),
      });
    });

    this.event ? this.editEvent(data) : this.addEvent(data);
  }

  addEvent(event: ShowroomEvent): void {
    this.restService
      .addCollection<ShowroomEvent>(this.collection, event, true)
      .subscribe(() => {
        this.router.navigate(['/events']);
      });
  }

  editEvent(event: ShowroomEvent): void {
    if (!event._id) {
      return;
    }

    this.restService
      .updateCollection<ShowroomEvent>(this.collection, event._id, event, true)
      .subscribe({
        next: () => {
          this.getEvent(event._id!).subscribe((event) => {
            this.event = {
              _id: event._id!,
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
              email: event.showroom?.email ?? '',
              tel: event.showroom?.tel ?? '',
              sessions: event.sessions.map(formatSession),
            };
            this.populateForm();
          });
        },
        error: (error) => {
          // TODO: have error handling
          console.error('Error updating event:', error);
        },
      });
  }

  onDelete(): void {
    if (!this.event?._id) {
      return;
    }

    this.restService
      .deleteCollection<ShowroomEvent>(this.collection, this.event._id)
      .subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (error) => {
          // TODO: error handling
          console.error('Error deleting event:', error);
        },
      });
  }

  addSession() {
    this.selection.clear();
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '320px',
      data: sessionFields(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sessions.push({
          date: result.date,
          startTime: result.startTime,
          endTime: result.endTime,
        });
        this.table().renderRows();
      }
    });
  }

  removeSession() {
    this.sessions = this.sessions.filter((session) => {
      return !this.selection.has(session);
    });
    this.selection.clear();
    this.table().renderRows();
  }

  selectionToggle(element: FormattedSession) {
    if (this.selection.has(element)) {
      this.selection.delete(element);
    } else {
      this.selection.add(element);
    }
  }

  checkboxLabel(row: FormattedSession): string {
    return `${this.selection.has(row) ? 'deselect' : 'select'} element`;
  }
}

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  imports: [
    SharedFieldFormComponent,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
})
export class SessionDialogComponent {
  sessionForm = new FormGroup({
    date: new FormControl<Date | null>(null),
    startTime: new FormControl('', { nonNullable: true }),
    endTime: new FormControl('', { nonNullable: true }),
  });

  constructor(
    public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public formField: FieldInput,
  ) {}

  onConfirm(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.sessionForm.getRawValue());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
