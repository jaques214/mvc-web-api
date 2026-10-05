import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { type Event, eventFields, sessionFields } from '@models/events';
import { MatTable, MatTableModule } from '@angular/material/table';
import { normalizeImageName, calcTime, formatSession, formatDate } from '@shared/utils';
import { API_ENDPOINT } from '@shared/index'
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SharedFieldFormComponent } from '@components/shared/form-field/shared-field-form.component';
import { FieldInput, Schema, Showroom } from '@models/index';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css'],
  imports: [RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule, SharedFieldFormComponent, MatTableModule, ReactiveFormsModule],
})
export class FormEventsComponent implements OnInit {
  title?: string;
  event?: Event;
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

  imageFieldPath?: string;
  imageFieldName?: string;
  fileSelected?: File;

  sessions: any[] = [];

  @ViewChild(MatTable) table!: MatTable<any>;
  displayedColumnsSessions: string[] = ['select', 'date', 'startTime', 'endTime'];
  selection = new Set();

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.event = routeState.event;
      this.populateForm()
    }
  }
  getEvent(eventId: string): Observable<any> {
    return this.restService.getCollection<Event>(this.collection, eventId);
  }

  populateForm() {
    this.eventForm.patchValue({
      title: this.event?.title ?? '',
      price: this.event?.price ?? null,
      description: this.event?.description ?? '',
      showroom: this.event?.showroom?.name ?? '',
      promoter: this.event?.promoter ?? '',
      minimumAge: this.event?.minimumAge ?? null,
      saleStartDate: this.event?.saleStartDate ? new Date(this.event.saleStartDate) : null,
      saleEndDate: this.event?.saleEndDate ? new Date(this.event.saleEndDate) : null,
    });
    const image = (this.event?.poster as unknown as string);
    this.imageFieldPath = `${API_ENDPOINT}/${image}`;
    this.imageFieldName = normalizeImageName(image);

    this.sessions = this.event?.sessions?.map(formatSession) || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id && !this.event) {
      this.getEvent(id).subscribe((event) => {
        this.event = event;
        this.populateForm();
      });
    }
  }

  // Using Event interface is not possible due to Event model class
  onFileSelected(event: any): void {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const values = this.eventForm.getRawValue();
    const data: Event = {
      ...this.event,
      title: values.title,
      price: values.price ?? undefined,
      description: values.description,
      showroom: values.showroom
        ? { ...this.event?.showroom, name: values.showroom } as Showroom
        : undefined,
      promoter: values.promoter,
      minimumAge: values.minimumAge ?? undefined,
      saleStartDate: values.saleStartDate ?? undefined,
      saleEndDate: values.saleEndDate ?? undefined,
    };

    data.poster = this.fileSelected;
    data.sessions = [];
    this.sessions.forEach(session => {
      const timeStart = calcTime(session.startTime);
      const timeEnd = calcTime(session.endTime);
      data.sessions?.push({
        date: new Date(session.date),
        startTime: new Date(timeStart),
        endTime: new Date(timeEnd)
      })
    })

    this.event ? this.editEvent(data) : this.addEvent(data);
  }

  addEvent(event: Event): void {
    this.restService.addCollection<Event>(this.collection, event, true).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }

  editEvent(event: Event): void {
    if (!event._id) {
      return;
    }

    this.restService.updateCollection<Event>(this.collection, event._id, event, true).subscribe({
      next: () => {
        this.getEvent(event._id!).subscribe((event) => {
          this.event = event;
          this.populateForm();
        });
      },
      error: error => {
        // TODO: have error handling 
      }
    });
  }

  onDelete(): void {
    if (!this.event?._id) {
      return;
    }

    this.restService.deleteCollection<Event>(this.collection, this.event._id).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
      error: error => {
        // TODO: error handling
      }
    });
  }

  addSession() {
    this.selection.clear();
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: '320px',
      data: sessionFields()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sessions.push({
          date: formatDate(result.date),
          startTime: result.startTime,
          endTime: result.endTime,
        })
        this.table.renderRows();
      }
    });
  }

  removeSession() {
    this.sessions = this.sessions.filter(session => {
      return !this.selection.has(session);
    });
    this.selection.clear();
    this.table.renderRows();
  }

  selectionToggle(element: any) {
    this.selection.has(element) ? this.selection.delete(element) : this.selection.add(element)
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.has(row) ? 'deselect' : 'select'} element`;
  }
}


@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  imports: [SharedFieldFormComponent, MatButtonModule, MatDialogModule, ReactiveFormsModule]
})
export class SessionDialogComponent {
  sessionForm = new FormGroup({
    date: new FormControl<Date | null>(null),
    startTime: new FormControl('', { nonNullable: true }),
    endTime: new FormControl('', { nonNullable: true }),
  });

  constructor(public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public formField: FieldInput) { }

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