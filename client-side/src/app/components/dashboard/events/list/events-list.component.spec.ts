import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventsComponent } from './events-list.component';
import { RestService } from '@services/rest.service';
import { delay, of } from 'rxjs';

describe('ListEventsComponent', () => {
  let component: ListEventsComponent;
  let fixture: ComponentFixture<ListEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListEventsComponent ],
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
    fixture = TestBed.createComponent(ListEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
