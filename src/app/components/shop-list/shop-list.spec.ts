import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListComponent } from './shop-list';

describe('ShopListComponent', () => {
  let component: ShopListComponent;
  let fixture: ComponentFixture<ShopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
