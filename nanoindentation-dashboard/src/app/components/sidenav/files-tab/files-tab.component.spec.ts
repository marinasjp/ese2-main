import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FilesTabComponent} from './files-tab.component';

describe('FilesTabComponent', () => {
  let component: FilesTabComponent;
  let fixture: ComponentFixture<FilesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilesTabComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
