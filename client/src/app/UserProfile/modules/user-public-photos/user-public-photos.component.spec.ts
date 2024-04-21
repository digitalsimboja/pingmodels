import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicPhotosComponent } from './user-public-photos.component';

describe('UserPublicPhotosComponent', () => {
  let component: UserPublicPhotosComponent;
  let fixture: ComponentFixture<UserPublicPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPublicPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublicPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
