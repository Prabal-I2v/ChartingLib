import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoDashboardComponent } from './kendo-dashboard.component';

describe('KendoDashboardComponent', () => {
  let component: KendoDashboardComponent;
  let fixture: ComponentFixture<KendoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KendoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KendoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
