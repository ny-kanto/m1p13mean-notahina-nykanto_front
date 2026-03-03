import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCenterComponent } from './header-center';

describe('HeaderCenterComponent', () => {
  let component: HeaderCenterComponent;
  let fixture: ComponentFixture<HeaderCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCenterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
