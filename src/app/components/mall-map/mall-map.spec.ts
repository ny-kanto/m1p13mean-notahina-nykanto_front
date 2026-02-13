import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallMap } from './mall-map';

describe('MallMap', () => {
  let component: MallMap;
  let fixture: ComponentFixture<MallMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MallMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MallMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
