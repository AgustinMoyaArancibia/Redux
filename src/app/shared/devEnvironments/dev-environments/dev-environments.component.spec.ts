import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevEnvironmentsComponent } from './dev-environments.component';

describe('DevEnvironmentsComponent', () => {
  let component: DevEnvironmentsComponent;
  let fixture: ComponentFixture<DevEnvironmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevEnvironmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
