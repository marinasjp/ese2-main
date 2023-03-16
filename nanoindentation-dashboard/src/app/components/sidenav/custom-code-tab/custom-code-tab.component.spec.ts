import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { CustomCodeTabComponent } from './custom-code-tab.component';

describe('CustomCodeTabComponent', () => {
  let component: CustomCodeTabComponent;
  let fixture: ComponentFixture<CustomCodeTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        CustomCodeTabComponent
      ]
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CustomCodeTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});