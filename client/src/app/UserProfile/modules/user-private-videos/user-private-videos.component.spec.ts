import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivateVideosComponent } from './user-private-videos.component';

describe('UserPrivateVideosComponent', () => {
  let component: UserPrivateVideosComponent;
  let fixture: ComponentFixture<UserPrivateVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPrivateVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrivateVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
