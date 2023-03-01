import {Component} from '@angular/core';
import {ProcessorService} from "./services/processor.service";
import {EProcType} from "./models/process.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nanoindentation-dashboard';

  constructor(public processorService: ProcessorService) {
  }

  test() {
    this.processorService.doProcess('testProcess.py', EProcType.TEST,
      {x: [100, 200, 300, 400], y: [200, 100, 100, 100]});
  }
}
