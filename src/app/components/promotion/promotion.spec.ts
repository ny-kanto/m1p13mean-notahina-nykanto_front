import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionComponent } from './promotion';

describe('PromotionComponent', () => {
  let component: PromotionComponent;
  let fixture: ComponentFixture<PromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
