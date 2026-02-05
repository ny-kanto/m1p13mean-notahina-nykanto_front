import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHome } from './header-home';

describe('HeaderHome', () => {
  let component: HeaderHome;
  let fixture: ComponentFixture<HeaderHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
