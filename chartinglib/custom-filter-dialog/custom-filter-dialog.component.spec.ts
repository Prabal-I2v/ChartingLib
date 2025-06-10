import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilterDialogComponent } from './custom-filter-dialog.component';

describe('CustomFilterDialogComponent', () => {
  let component: CustomFilterDialogComponent;
  let fixture: ComponentFixture<CustomFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFilterDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
