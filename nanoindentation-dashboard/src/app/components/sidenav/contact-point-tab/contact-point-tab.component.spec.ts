import {ComponentFixture, TestBed} from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {ContactPointTabComponent} from './contact-point-tab.component';

describe('ContactPointTabComponent', () => {
  //let component: ContactPointTabComponent;
  //let fixture: ComponentFixture<ContactPointTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[ContactPointTabComponent]
    }).compileComponents();

    
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContactPointTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
