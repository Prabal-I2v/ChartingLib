import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetFormPreviewComponent } from './widget-form-preview.component';

describe('WidgetFormPreviewComponent', () => {
  let component: WidgetFormPreviewComponent;
  let fixture: ComponentFixture<WidgetFormPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetFormPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetFormPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
