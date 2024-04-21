import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPrivateVideosComponent } from './model-private-videos.component';

describe('ModelPrivateVideosComponent', () => {
  let component: ModelPrivateVideosComponent;
  let fixture: ComponentFixture<ModelPrivateVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPrivateVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPrivateVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
