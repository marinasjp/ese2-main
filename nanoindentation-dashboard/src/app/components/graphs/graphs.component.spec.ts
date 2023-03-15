import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { GraphsComponent } from './graphs.component';

describe('GraphsComponent', () => {
  //let component: GraphsComponent;
  //let fixture: ComponentFixture<GraphsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        GraphsComponent
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GraphsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
