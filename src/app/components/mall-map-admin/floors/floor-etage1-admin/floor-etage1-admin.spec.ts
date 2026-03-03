import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorEtage1Admin } from './floor-etage1-admin';

describe('FloorEtage1Admin', () => {
  let component: FloorEtage1Admin;
  let fixture: ComponentFixture<FloorEtage1Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorEtage1Admin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorEtage1Admin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
