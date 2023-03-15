import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCodeTabComponent } from './custom-code-tab.component';

describe('CustomCodeTabComponent', () => {
  let component: CustomCodeTabComponent;
  let fixture: ComponentFixture<CustomCodeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCodeTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCodeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
