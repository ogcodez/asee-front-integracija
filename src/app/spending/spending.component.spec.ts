import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingComponent } from './spending.component';

describe('SpendingComponent', () => {
  let component: SpendingComponent;
  let fixture: ComponentFixture<SpendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpendingComponent]
    });
    fixture = TestBed.createComponent(SpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
