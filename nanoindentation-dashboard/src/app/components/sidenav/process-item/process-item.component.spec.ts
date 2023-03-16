import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessItemComponent } from './process-item.component';

describe('ProcessItemComponent', () => {
  let component: ProcessItemComponent;
  let fixture: ComponentFixture<ProcessItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
