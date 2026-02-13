import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRdc } from './floor-rdc';

describe('FloorRdc', () => {
  let component: FloorRdc;
  let fixture: ComponentFixture<FloorRdc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorRdc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorRdc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
