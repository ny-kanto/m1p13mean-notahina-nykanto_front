import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailBoutique } from './product-detail-boutique';

describe('ProductDetailBoutique', () => {
  let component: ProductDetailBoutique;
  let fixture: ComponentFixture<ProductDetailBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
