import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsComponent } from './tickets.component';
import { RestService } from '@services/rest.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsComponent],
      providers: [
        {
          provide: RestService,
          useValue: {
            addCollection: () => of({}),
          },
        },
        provideRouter(routes),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
