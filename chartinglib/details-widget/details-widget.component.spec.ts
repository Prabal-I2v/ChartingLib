import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWidgetComponent } from './details-widget.component';

describe('DetailsWidgetComponent', () => {
  let component: DetailsWidgetComponent;
  let fixture: ComponentFixture<DetailsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
