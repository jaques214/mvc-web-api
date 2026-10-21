import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEventsListComponent } from './client-events-list.component';
import { RestService } from '@services/rest.service';
import { delay, of } from 'rxjs';

describe('ClientEventsListComponent', () => {
  let component: ClientEventsListComponent;
  let fixture: ComponentFixture<ClientEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ClientEventsListComponent ],
      providers: [
        {
          provide: RestService,
          useValue: {
            getAllCollections: () => of([]).pipe(delay(0)),
          },
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ClientEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
