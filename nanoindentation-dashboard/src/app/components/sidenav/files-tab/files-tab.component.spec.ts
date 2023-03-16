import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FilesTabComponent } from './files-tab.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {CommonModule} from "@angular/common";

describe('FilesTabComponent', () => {
  let component: FilesTabComponent;
  let fixture: ComponentFixture<FilesTabComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilesTabComponent],
      imports: [HttpClientTestingModule, HttpClientModule, CommonModule],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});






// import {ComponentFixture, TestBed} from '@angular/core/testing';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import {HttpClientModule} from '@angular/common/http';
// import {FilesTabComponent} from './files-tab.component';



// describe('FilesTabComponent', () => {
//   //let component: FilesTabComponent;
//   //let fixture: ComponentFixture<FilesTabComponent>;

//   beforeEach(async () => {
//     TestBed.configureTestingModule({
//       imports:[
//         HttpClientModule,
//       ],
//       providers:[
//         FilesTabComponent],
//     }).compileComponents();
//   });

//   it('should create', () => {
//     const fixture = TestBed.createComponent(FilesTabComponent);
//     const component = fixture.componentInstance;
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//   });
// });
