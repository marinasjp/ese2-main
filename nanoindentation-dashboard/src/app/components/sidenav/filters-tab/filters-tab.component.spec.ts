import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { FiltersTabComponent } from './filters-tab.component';

describe('FiltersTabComponent', () => {
  let component: FiltersTabComponent;
  let fixture: ComponentFixture<FiltersTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        FiltersTabComponent
      ]
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FiltersTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});