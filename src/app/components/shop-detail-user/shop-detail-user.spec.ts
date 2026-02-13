import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailUserComponent } from './shop-detail-user';

describe('ShopDetailUser', () => {
  let component: ShopDetailUserComponent;
  let fixture: ComponentFixture<ShopDetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDetailUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDetailUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
