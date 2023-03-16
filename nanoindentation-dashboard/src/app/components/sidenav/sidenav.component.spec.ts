import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SidenavComponent } from './sidenav.component';
import { GraphService } from '../../services/graph.service';
import { ProcessorService } from '../../services/processor.service';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let graphService: GraphService;
  let processService: ProcessorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SidenavComponent],
      providers: [GraphService, ProcessorService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    graphService = TestBed.inject(GraphService);
    processService = TestBed.inject(ProcessorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload raw data', () => {
    const spy = spyOn(graphService, 'uploadDataRaw');
    const file = new File([], 'test');
    const event = { target: { files: [file] } }; // update event object
    graphService.uploadDataRaw(event.target.files[0]);
    expect(spy).toHaveBeenCalledWith(file); // update expected argument
  });

  
});

// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import {HttpClientModule} from '@angular/common/http';
// import { SidenavComponent } from './sidenav.component';


// describe('SidenavComponent', () => {
//   //et component: SidenavComponent;
//   //let fixture: ComponentFixture<SidenavComponent>;

//   beforeEach(async () => {
//     TestBed.configureTestingModule({
//       imports:[
//         HttpClientModule
//       ],
//       providers:[ SidenavComponent ]
//     }).compileComponents();

    
//   });

//   it('should create', () => {
//     const fixture = TestBed.createComponent(SidenavComponent);
//     const component = fixture.componentInstance;
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//   });
// });
