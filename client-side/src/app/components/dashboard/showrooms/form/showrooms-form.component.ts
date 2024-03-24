import { Component, OnInit } from '@angular/core';
import { Showroom } from '@models/showrooms';
import { RestService } from '@services/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-showrooms-form',
  templateUrl: './showrooms-form.component.html',
  styleUrls: ['./showrooms-form.component.css']
})
export class FormShowroomsComponent implements OnInit{
  title?: string;
  showroom?: Showroom;
  collection = 'Showroom';
  formFields:any = Showroom.fields();

  constructor(private restService: RestService, private route: ActivatedRoute, private router: Router) {
    const routeState = this.router?.getCurrentNavigation()?.extras?.state
    if (routeState) {
      this.showroom = routeState.showroom;
      this.populateForm()
    }
  }
  getShowroom(showroomId: string): Observable<any>{
    return this.restService.getCollection<Showroom>(this.collection, showroomId);
  }

  populateForm(){
    //if a showroom already exists populates the formFields inputs.
    this.formFields.inputs.forEach((input:any) => {
      input.model! = (this.showroom as any)[input.name!];
      if(input.name == 'address'){
        input.inputs.forEach((field:any) => {
          field.model! = (this.showroom?.address as any)?.[field.name!];
        });
      }
      if(input.name == 'limit'){
        input.model *= 100;
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if(id && !this.showroom){
      this.getShowroom(id).subscribe((showroom) => {
        this.showroom = showroom;
        this.populateForm();
      });
    }
  }

  onSubmit(): void {
    const data = this.showroom || new Showroom();
    this.formFields.inputs.forEach((input:any) => {
      (data as any)[input.name!] = input.model;

      if(input.name == 'address'){
        data.address || (data.address = {});
        input.inputs.forEach((field:any) => {
          (data.address as any)[field.name!] = field.model;
        });
      }
    });
    data.limit /= 100;
    this.showroom ? this.editShowroom(data) : this.addShowroom(data);
  }

  addShowroom(showroom: Showroom): void {
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
   this.restService.deleteCollection<Showroom>(this.collection, this.showroom?._id).subscribe({
    next: () => {
      this.router.navigate(['dashboard/showrooms']);
    },
    error: error => {
      // TODO: error handling
    }
  });
  }
}
