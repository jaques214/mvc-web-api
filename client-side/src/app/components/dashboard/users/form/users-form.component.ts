import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User, userFields } from '@models/users';
import { Schema } from '@models/index';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedFieldFormComponent } from '@src/app/components/shared/form-field/shared-field-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css'],
  imports: [RouterModule, SharedFieldFormComponent, MatCardModule, MatIconModule, ReactiveFormsModule, MatButtonModule],
})
export class FormUsersComponent implements OnInit {
  title?: string;
  user?: User;
  collection: Schema = 'User';
  formFields = userFields();
  fileSelected?: File;
  userForm = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true }),
  });

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.user = routeState.user;
      this.populateForm()
    }
  }
  getUser(userId: string): Observable<any> {
    return this.restService.getCollection<User>(this.collection, userId);
  }

  populateForm() {
    this.userForm.patchValue({
      username: this.user?.username ?? '',
      password: '',
      name: this.user?.name ?? '',
      role: this.user?.role?.value ?? '',
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id && !this.user) {
      this.getUser(id).subscribe((user) => {
        this.user = user;
        this.populateForm();
      });
    }
  }

  // Using User interface is not possible due to User model class
  onFileSelected(user: any): void {
    const target: HTMLInputElement | null = user.target as HTMLInputElement;
    this.fileSelected = target?.files?.[0] as File;
  }

  onSubmit(): void {
    const values = this.userForm.getRawValue();
    const data: User = {
      ...this.user,
      username: values.username,
      name: values.name,
      role: { value: values.role },
    };
    if (values.password) {
      data.password = values.password;
    }

    this.user?._id ? this.editUser({ ...data, _id: this.user._id }) : this.addUser(data);
  }

  addUser(user: User): void {
    this.restService.addCollection<User>(this.collection, user, true).subscribe(() => {
      this.router.navigate(['dashboard/users']);
    });
  }

  editUser(user: User): void {
    if (!user._id) {
      return;
    }

    this.restService.updateCollection<User>(this.collection, user._id, user, true).subscribe({
      next: () => {
        this.getUser(user._id!).subscribe((user) => {
          this.user = user;
          this.populateForm();
        });
      },
      error: error => {
        // TODO: have error handling 
      }
    });
  }

  onDelete(): void {
    if (!this.user?._id) {
      return;
    }

    this.restService.deleteCollection<User>(this.collection, this.user?._id).subscribe({
      next: () => {
        this.router.navigate(['dashboard/users']);
      },
      error: error => {
        // TODO: error handling
      }
    });
  }
}