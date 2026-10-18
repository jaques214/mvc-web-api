import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEventsListComponent } from './client-events-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ClientEventsListComponent', () => {
  let component: ClientEventsListComponent;
  let fixture: ComponentFixture<ClientEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ClientEventsListComponent ],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
