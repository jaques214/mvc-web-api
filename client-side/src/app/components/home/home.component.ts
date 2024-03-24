import { RestService } from '@services/rest.service';
import { Component, OnInit } from '@angular/core';
import { Event } from '@models/events';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINT } from '@shared/index';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  collection = 'Event';
  data$!: Observable<any>;
  highlights$!: Observable<any>;
  fresh$!: Observable<any>;
  imageFieldPath?:string;
  title = 'Browser market shares at a specific website, 2014';
  type='PieChart';
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7]
 ];
 columnNames = ['Browser', 'Percentage'];
 options = {
  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'], is3D: true
};
width = 550;
height = 400;

  constructor(private restService: RestService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.data$ = this.restService
      .getAllCollections<Event>(this.collection)

    this.highlights$ = this.data$.pipe(map(events => {
      return events.filter((event:Event) => {
        const image = (event?.poster as unknown as string);
        (event as any).imageFieldPath ||= `${API_ENDPOINT}/${image}`;
        return true
      })
    }))


  }

  onView(event:any) {
    this.router.navigate(['/events/detail/' + event._id], {
      state: {
        event,
      },
    });
  }

  onBuy(event:any) {
    this.router.navigate(['/ticket'], {
      state: {
        event,
      },
    });
  }

}
