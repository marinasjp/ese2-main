import {Component} from '@angular/core';
import {GraphService} from "../../services/graph.service";
import {ProcessorService} from "../../services/processor.service";
import {Process} from "../../models/process.model";
import {Dataset} from "../../models/dataset.model";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  useProminency: boolean = true;
  prominency: number = null;
  minFrequency: number = null;
  band: number = null;
  uploadedCode: any = [];
  output: any;
  result: any;
  forceIndMin: any;
  forceIndMax: any;
  spectraMin: any;
  spectraMax: any;

  filterSelect: number;
  consoleItems: string[];
  //consoleItems = new Array(1000);

  filters: Process[] = [];


  // filters: { id: number, name: string, inputs?: string[] }[] = [
  //   {id: 1, name: "Median Filter", inputs: ["Window Length [nm]", "Polynomical Order (int)"]},
  //   {id: 2, name: "Sawitzky Golay", inputs: ["Window Length [nm]"]}
  // ]
  // selectedFilters: { id: number, name: string, inputs?: string[] }[] = [];

  indShapes: { name: string } [] = [
    {name: "Sphere"},
    {name: "Cylinder"},
    {name: "Cone"},
    {name: "Pyramid"}
  ]
  selectedIndShape: { name: string }[] = [];

  constructor(public graphService: GraphService,
              public processService: ProcessorService) {
  }

  ngOnInit() {
    this.filters = this.processService.availableProcesses.filters;
    this.consoleItems = []
  }

  codeUploadHandler(event: any) {
    console.log("START UPLOADING")
    this.uploadedCode = event.files;
    console.log(this.uploadedCode)
  }

  uploadrawHandler(event: any) {
    const file = event.files && event.files[0];
    this.graphService.uploadData(file);
  }

  runCode(code: string) {
    console.log(globalThis.pyodide.runPython());
    globalThis.pyodide.runPython('def multiply(); return 3+4');
    let func = globalThis.pyodide.globals.get('multiply');
    globalThis.pyodide.runPython(code).then((result) => {
      this.consoleItems.push(result);
      this.consoleItems = this.consoleItems;
      console.log(this.consoleItems);
      this.output = result;
    });
  }


};


