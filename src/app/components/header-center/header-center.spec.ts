import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCenter } from './header-center';

describe('HeaderCenter', () => {
  let component: HeaderCenter;
  let fixture: ComponentFixture<HeaderCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
