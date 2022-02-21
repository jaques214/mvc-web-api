import { Component, OnInit } from '@angular/core';
import { User } from '@models/users';
import { Client } from '@models/clients';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class FormUsersComponent implements OnInit{
  title?: string;
  user?: User;
  collection = 'User';
  formFields:any = User.fields();
  fileSelected?: File;
  client: any = new Client();

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.user = routeState.user;
      this.populateForm()
    }
  }
  getUser(userId: string): Observable<any>{
    return this.restService.getCollection<User>(this.collection, userId);
  }

  populateForm(){
    this.formFields.inputs.forEach((input:any) => {
      input.model! = (this.user as any)[input.name!];
      if(input.name == 'password'){
        input.model = undefined;
      }
      if(input.name == 'role'){
        input.model = this.user?.role?.value
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if(id && !this.user){
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
    const data = this.user || new User();
    this.formFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;
      if(input.name == 'role'){
        data.role = {
          value: this.user?.role
        } as any
      }
    });
    if(!data.password){
      delete data.password;
    }
    
    this.user ? this.editUser(data) : this.addUser(data);
  }

  addUser(user: User): void {
    this.restService.addCollection<User>(this.collection, user, true).subscribe(() => {
      this.router.navigate(['dashboard/users']);
    });
  }

  editUser(user: User): void {
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