import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEventsDetailComponent } from './client-events-detail.component';

describe('ClientEventsDetailComponent', () => {
  let component: ClientEventsDetailComponent;
  let fixture: ComponentFixture<ClientEventsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientEventsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEventsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
