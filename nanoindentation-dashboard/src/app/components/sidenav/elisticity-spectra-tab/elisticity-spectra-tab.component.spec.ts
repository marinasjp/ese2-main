import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElisticitySpectraTabComponent } from './elisticity-spectra-tab.component';

describe('ElisticitySpectraTabComponent', () => {
  let component: ElisticitySpectraTabComponent;
  let fixture: ComponentFixture<ElisticitySpectraTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElisticitySpectraTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElisticitySpectraTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
