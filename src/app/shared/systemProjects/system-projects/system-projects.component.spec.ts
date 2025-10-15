import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemProjectsComponent } from './system-projects.component';

describe('SystemProjectsComponent', () => {
  let component: SystemProjectsComponent;
  let fixture: ComponentFixture<SystemProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
