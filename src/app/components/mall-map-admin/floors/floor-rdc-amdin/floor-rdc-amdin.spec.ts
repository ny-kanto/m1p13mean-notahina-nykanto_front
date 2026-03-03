import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRdcAmdin } from './floor-rdc-amdin';

describe('FloorRdcAmdin', () => {
  let component: FloorRdcAmdin;
  let fixture: ComponentFixture<FloorRdcAmdin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorRdcAmdin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorRdcAmdin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
