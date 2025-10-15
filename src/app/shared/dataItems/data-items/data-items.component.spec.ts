import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataItemsComponent } from './data-items.component';

describe('DataItemsComponent', () => {
  let component: DataItemsComponent;
  let fixture: ComponentFixture<DataItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
