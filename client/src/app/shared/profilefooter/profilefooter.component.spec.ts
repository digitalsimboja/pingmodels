import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilefooterComponent } from './profilefooter.component';

describe('ProfilefooterComponent', () => {
  let component: ProfilefooterComponent;
  let fixture: ComponentFixture<ProfilefooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilefooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilefooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
