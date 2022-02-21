import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShowroomsComponent } from './showrooms-list.component';

describe('ListShowroomsComponent', () => {
  let component: ListShowroomsComponent;
  let fixture: ComponentFixture<ListShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShowroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShowroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
