import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicVideosComponent } from './user-public-videos.component';

describe('UserPublicVideosComponent', () => {
  let component: UserPublicVideosComponent;
  let fixture: ComponentFixture<UserPublicVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPublicVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublicVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
