import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  type Ticket,
  type FormattedSession,
  TicketType,
  Method,
} from '@models/index';
import { MatTable, MatTableModule } from '@angular/material/table';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientEventViewTable } from '../events/list/client-events-list.component';

type SessionViewTable = FormattedSession & {
  viewValue: string;
};

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  imports: [
    MatFormFieldModule,
    MatStepperModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class TicketsComponent implements OnInit {
  event!: ClientEventViewTable;
  firstFormGroup = this._formBuilder.group({
    session: [null as SessionViewTable | null, Validators.required],
    covidTest: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    quantity: [0, Validators.required],
  });
  sessions!: SessionViewTable[];
  @ViewChild(MatTable) table!: MatTable<SessionViewTable>;
  columnsToDisplay = ['viewValue', 'date', 'startTime', 'endTime'];
  columnsToDisplayHeaders: Record<string, string> = {
    viewValue: 'Option',
    date: 'Date',
    startTime: 'Start',
    endTime: 'End',
  };

  imageFieldPath?: string;
  imageFieldName?: string;
  fileSelected?: File;

  constructor(
    private _formBuilder: FormBuilder,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state;
    if (routeState) {
      this.event = routeState.event;
      this.populateFields();
    }
  }
  populateFields() {
    this.sessions = this.event.sessions
      .map((session, index) => ({
        ...session,
        viewValue: `Session ${index + 1}`,
      }));
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      session: [null as SessionViewTable | null, Validators.required],
      covidTest: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      quantity: [0, Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const target: HTMLInputElement | null = event.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0];
    this.firstFormGroup.get('covidTest')?.setValue(this.fileSelected?.name ?? '');
  }

  onBuy() {
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) return;
    const session = this.firstFormGroup.value.session;
    const covidTest = this.fileSelected;
    if (!session || !covidTest) {
      this.firstFormGroup.markAllAsTouched();
      return;
    }
    if (!session._id) {
      console.error('Selected session is missing its identifier.');
      return;
    }

    this.restService
      .addCollection<Ticket>(
        'Ticket',
        {
          price: 0.0,
          status: 'pending',
          type:
            this.secondFormGroup.value.quantity === 1
              ? TicketType.Single
              : TicketType.Family,
          paymentMethod: Method.Multibanco,
          eventId: this.event._id,
          sessionId: session._id,
          saleDate: new Date(),
          covidTest,
        },
        true,
      )
      .subscribe(() => {
        this.router.navigate(['/events']);
      }, (error: unknown) => console.error('Failed to purchase ticket:', error));
  }
}
