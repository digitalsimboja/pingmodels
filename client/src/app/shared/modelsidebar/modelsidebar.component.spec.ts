import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsidebarComponent } from './modelsidebar.component';

describe('ModelsidebarComponent', () => {
  let component: ModelsidebarComponent;
  let fixture: ComponentFixture<ModelsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
