import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPrivatePhotosComponent } from './model-private-photos.component';

describe('ModelPrivatePhotosComponent', () => {
  let component: ModelPrivatePhotosComponent;
  let fixture: ComponentFixture<ModelPrivatePhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPrivatePhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPrivatePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
