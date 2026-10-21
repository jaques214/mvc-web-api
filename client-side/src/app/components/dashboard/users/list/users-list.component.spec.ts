import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersComponent } from './users-list.component';
import { RestService } from '@services/rest.service';
import { delay, of } from 'rxjs';

describe('ListUsersComponent', () => {
  let component: ListUsersComponent;
  let fixture: ComponentFixture<ListUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ListUsersComponent ],
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
    fixture = TestBed.createComponent(ListUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
