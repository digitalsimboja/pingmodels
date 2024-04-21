import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPublicVideosComponent } from './model-public-videos.component';

describe('ModelPublicVideosComponent', () => {
  let component: ModelPublicVideosComponent;
  let fixture: ComponentFixture<ModelPublicVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPublicVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPublicVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
