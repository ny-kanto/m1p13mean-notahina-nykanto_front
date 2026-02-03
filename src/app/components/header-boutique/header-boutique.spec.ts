import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBoutique } from './header-boutique';

describe('HeaderBoutique', () => {
  let component: HeaderBoutique;
  let fixture: ComponentFixture<HeaderBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
