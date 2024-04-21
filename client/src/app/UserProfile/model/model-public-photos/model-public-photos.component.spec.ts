import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPublicPhotosComponent } from './model-public-photos.component';

describe('ModelPublicPhotosComponent', () => {
  let component: ModelPublicPhotosComponent;
  let fixture: ComponentFixture<ModelPublicPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPublicPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPublicPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
