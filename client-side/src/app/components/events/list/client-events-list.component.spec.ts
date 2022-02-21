import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEventsListComponent } from './client-events-list.component';

describe('ClientEventsListComponent', () => {
  let component: ClientEventsListComponent;
  let fixture: ComponentFixture<ClientEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientEventsListComponent ]
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
