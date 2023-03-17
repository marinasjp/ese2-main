import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadSettingsTabComponent} from './download-settings-tab.component';

describe('DownloadSettingsTabComponent', () => {
  let component: DownloadSettingsTabComponent;
  let fixture: ComponentFixture<DownloadSettingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadSettingsTabComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DownloadSettingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
