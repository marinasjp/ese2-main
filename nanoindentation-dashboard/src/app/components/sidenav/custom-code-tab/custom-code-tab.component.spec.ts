import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCodeTabComponent } from './custom-code-tab.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

describe('CustomCodeTabComponent', () => {
  let component: CustomCodeTabComponent;
  let fixture: ComponentFixture<CustomCodeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule
      ],
      declarations: [ CustomCodeTabComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCodeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
