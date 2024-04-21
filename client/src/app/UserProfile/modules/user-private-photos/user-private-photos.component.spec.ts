import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivatePhotosComponent } from './user-private-photos.component';

describe('UserPrivatePhotosComponent', () => {
  let component: UserPrivatePhotosComponent;
  let fixture: ComponentFixture<UserPrivatePhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPrivatePhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrivatePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
