import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { DownloadTabComponent } from './download-tab.component';

describe('DownloadTabComponent', () => {
  let component: DownloadTabComponent;
  let fixture: ComponentFixture<DownloadTabComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ],
      providers:[
        DownloadTabComponent
      ]
    })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DownloadTabComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
