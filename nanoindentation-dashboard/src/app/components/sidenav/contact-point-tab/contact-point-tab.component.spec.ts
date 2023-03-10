import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactPointTabComponent} from './contact-point-tab.component';

describe('ContactPointTabComponent', () => {
  let component: ContactPointTabComponent;
  let fixture: ComponentFixture<ContactPointTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactPointTabComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactPointTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
