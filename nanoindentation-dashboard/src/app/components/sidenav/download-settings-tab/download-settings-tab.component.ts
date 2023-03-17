import {Component, ViewChild} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {saveAs} from 'file-saver';
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-download-settings-tab',
  templateUrl: './download-settings-tab.component.html',
  styleUrls: ['./download-settings-tab.component.scss']
})
export class DownloadSettingsTabComponent {
  @ViewChild('fileUpload') fileUpload: any;

  uploadSuccessfulMessage: string = '';
  disabled: boolean = true;

  constructor(private processorService: ProcessorService,
              private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }

  downloadSettings() {
    let settingsObject: any = {
      availableProcesses: null,
      selectedFilters: null,
      selectedCPointProcess: null
    };

    settingsObject.availableProcesses = this.processorService.availableProcesses;
    settingsObject.selectedFilters = this.processorService.selectedFilters;
    settingsObject.selectedCPointProcess = this.processorService.selectedCPointProcess;

    console.log(settingsObject);

    let settingsString: string = JSON.stringify(settingsObject);
    const blob = new Blob([settingsString], {type: 'text/txt;charset=utf-8;'});
    saveAs(blob, 'nanoindentation-settings.txt')
  }

  uploadSettings(event: any) {
    let file: File = event.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let settings: string = fileReader.result as string;
      let settingsObject = JSON.parse(settings);
      this.processorService.updateSettings(settingsObject);
      this.uploadSuccessfulMessage = 'Settingsfile: ' + file.name + ' uploaded successfully ✔'
      this.fileUpload.clear()
    }

    fileReader.readAsText(file);
  }

}
