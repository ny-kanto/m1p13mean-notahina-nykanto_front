import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallMapAdmin } from './mall-map-admin';

describe('MallMapAdmin', () => {
  let component: MallMapAdmin;
  let fixture: ComponentFixture<MallMapAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MallMapAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MallMapAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
