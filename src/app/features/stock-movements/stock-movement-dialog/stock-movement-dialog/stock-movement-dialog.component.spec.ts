import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementDialogComponent } from './stock-movement-dialog.component';

describe('StockMovementDialogComponent', () => {
  let component: StockMovementDialogComponent;
  let fixture: ComponentFixture<StockMovementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMovementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
