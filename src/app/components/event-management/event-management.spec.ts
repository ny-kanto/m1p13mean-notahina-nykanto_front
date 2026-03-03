import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagementComponent } from './event-management';

describe('EventManagementComponent', () => {
  let component: EventManagementComponent;
  let fixture: ComponentFixture<EventManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
