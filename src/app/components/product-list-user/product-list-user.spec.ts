import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListUserComponent } from './product-list-user';

describe('ProductListUserComponent', () => {
  let component: ProductListUserComponent;
  let fixture: ComponentFixture<ProductListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
