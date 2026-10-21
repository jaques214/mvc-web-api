/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShowroomsComponent } from './showrooms-list.component';
import { RestService } from '@services/rest.service';
import { delay, of } from 'rxjs';

describe('ListShowroomsComponent', () => {
  let component: ListShowroomsComponent;
  let fixture: ComponentFixture<ListShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListShowroomsComponent],
      providers: [
        {
          provide: RestService,
          useValue: {
            getAllCollections: () => of([]).pipe(delay(0)),
          },
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ListShowroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
