import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorEtage1 } from './floor-etage1';

describe('FloorEtage1', () => {
  let component: FloorEtage1;
  let fixture: ComponentFixture<FloorEtage1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorEtage1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorEtage1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
