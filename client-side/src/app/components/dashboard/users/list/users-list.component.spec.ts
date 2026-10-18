import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersComponent } from './users-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ListUsersComponent', () => {
  let component: ListUsersComponent;
  let fixture: ComponentFixture<ListUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListUsersComponent ],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
