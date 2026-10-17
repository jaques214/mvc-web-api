import { RestService } from '@services/rest.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINT } from '@shared/index';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import type { Schema, ShowroomEvent } from '@models/index';

type HighlightEventViewTable = {
  _id: string;
  imageFieldPath: string;
  title: string;
  showroom: string;
  description: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [MatCardModule, CommonModule, MatButtonModule],
})
export class HomeComponent implements OnInit {
  collection: Schema = 'Event';
  data$!: Observable<ShowroomEvent[]>;
  highlights$!: Observable<HighlightEventViewTable[]>;
  imageFieldPath?: string;
  title = 'Browser market shares at a specific website, 2014';
  type = 'PieChart';
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7],
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    is3D: true,
  };
  width = 550;
  height = 400;

  constructor(
    private restService: RestService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.data$ = this.restService.getAllCollections<ShowroomEvent>(
      this.collection,
    );

    this.highlights$ = this.data$.pipe(
      map((events: ShowroomEvent[]) =>
        events
          .filter((event) => Boolean(event.poster))
          .map((event) => ({
            _id: event._id ?? crypto.randomUUID(),
            imageFieldPath: `${API_ENDPOINT}/${event.poster}`,
            title: event.title,
            showroom: event.showroom ? event.showroom.name : '',
            description: event.description,
          })),
      ),
    );
  }

  onView(event: HighlightEventViewTable) {
    this.router.navigate(['/events/detail/' + event._id], {
      state: {
        event,
      },
    });
  }

  onBuy(event: HighlightEventViewTable) {
    this.router.navigate(['/ticket'], {
      state: {
        event,
      },
    });
  }
}
