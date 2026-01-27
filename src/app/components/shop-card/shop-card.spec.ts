import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCardComponent } from './shop-card';

describe('ShopCardComponent', () => {
  let component: ShopCardComponent;
  let fixture: ComponentFixture<ShopCardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
