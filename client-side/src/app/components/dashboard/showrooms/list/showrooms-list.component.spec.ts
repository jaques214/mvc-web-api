/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShowroomsComponent } from './showrooms-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ListShowroomsComponent', () => {
  let component: ListShowroomsComponent;
  let fixture: ComponentFixture<ListShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListShowroomsComponent],
      providers: [provideHttpClient(withInterceptorsFromDi())]
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
