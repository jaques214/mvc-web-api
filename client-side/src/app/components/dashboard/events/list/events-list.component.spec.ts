import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEventsComponent } from './events-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ListEventsComponent', () => {
  let component: ListEventsComponent;
  let fixture: ComponentFixture<ListEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListEventsComponent ],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
