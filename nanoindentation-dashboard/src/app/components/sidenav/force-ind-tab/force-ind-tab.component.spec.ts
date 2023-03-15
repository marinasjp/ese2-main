import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceIndTabComponent } from './force-ind-tab.component';

describe('ForceIndTabComponent', () => {
  let component: ForceIndTabComponent;
  let fixture: ComponentFixture<ForceIndTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForceIndTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForceIndTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
