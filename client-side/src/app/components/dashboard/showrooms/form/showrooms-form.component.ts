import { Component, OnInit } from '@angular/core';
import { Address, FieldInput, Showroom, showroomFields, type Schema } from '@models/index';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedFieldFormComponent } from '@components/shared/form-field/shared-field-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-showrooms-form',
  templateUrl: './showrooms-form.component.html',
  styleUrls: ['./showrooms-form.component.css'],
  imports: [
    RouterModule,
    SharedFieldFormComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class FormShowroomsComponent implements OnInit {
  title?: string;
  showroom?: Showroom;
  collection: Schema = 'Showroom';
  formFields: FieldInput[] = showroomFields();
  showroomForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    address: new FormGroup({
      street: new FormControl('', { nonNullable: true }),
      number: new FormControl<number | null>(null),
      postalCode: new FormControl('', { nonNullable: true }),
      country: new FormControl('', { nonNullable: true }),
    }),
    email: new FormControl('', { nonNullable: true }),
    tel: new FormControl('', { nonNullable: true }),
    capacity: new FormControl<number | null>(null),
    limit: new FormControl<number | null>(null),
  });

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState?.showroom) {
      this.showroom = routeState.showroom;
      this.populateForm();
    }
  }

  get addressForm(): FormGroup {
    return this.showroomForm.controls.address;
  }

  getShowroom(showroomId: string): Observable<Showroom> {
    return this.restService.getCollection<Showroom>(this.collection, showroomId);
  }

  populateForm() {
    if (!this.showroom) {
      return;
    }

    this.showroomForm.patchValue({
      name: this.showroom.name,
      address: {
        street: this.showroom.address?.street ?? '',
        number: this.showroom.address?.number ?? null,
        postalCode: this.showroom.address?.postalCode ?? '',
        country: this.showroom.address?.country ?? '',
      },
      email: this.showroom.email,
      tel: this.showroom.tel,
      capacity: this.showroom.capacity,
      limit: this.showroom.limit * 100,
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id && !this.showroom) {
      this.getShowroom(id).subscribe((showroom) => {
        this.showroom = showroom;
        this.populateForm();
      });
    }
  }

  onSubmit(): void {
    if (this.showroomForm.invalid) {
      this.showroomForm.markAllAsTouched();
      return;
    }

    const values = this.showroomForm.getRawValue();
    const data = {
      name: values.name,
      address: {
        ...this.showroom?.address,
        ...values.address,
      } as Address,
      email: values.email,
      tel: values.tel,
      capacity: values.capacity ?? 0,
      limit: (values.limit ?? 0) / 100,
    };

    if (this.showroom?._id) {
      this.editShowroom({ ...data, _id: this.showroom._id });
    } else {
      this.addShowroom(data);
    }
  }

  addShowroom(showroom: Omit<Showroom, '_id'>): void {
    this.restService.addCollection<Showroom>(this.collection, showroom).subscribe(() => {
      this.router.navigate(['dashboard/showrooms']);
    });
  }

  editShowroom(showroom: Showroom): void {
    this.restService.updateCollection<Showroom>(this.collection, showroom._id, showroom).subscribe({
      next: () => {
        this.getShowroom(showroom._id!).subscribe((showroom) => {
          this.showroom = showroom;
          this.populateForm();
        });
      },
      error: error => {
        // TODO: have error handling
      }
    });
  }

  onDelete(): void {
    if (!this.showroom?._id) {
      return;
    }

    this.restService.deleteCollection<Showroom>(this.collection, this.showroom._id).subscribe({
      next: () => {
        this.router.navigate(['dashboard/showrooms']);
      },
      error: error => {
        // TODO: error handling
      }
    });
  }
}
