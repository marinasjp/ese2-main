import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { ElisticitySpectraTabComponent } from './elisticity-spectra-tab.component';

describe('ElisticitySpectraTabComponent', () => {
  let component: ElisticitySpectraTabComponent;
  let fixture: ComponentFixture<ElisticitySpectraTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
      ],
      providers:[
        ElisticitySpectraTabComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ElisticitySpectraTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});