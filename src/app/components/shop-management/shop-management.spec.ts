import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopManagementComponent } from './shop-management';

describe('ShopManagement', () => {
  let component: ShopManagementComponent;
  let fixture: ComponentFixture<ShopManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
