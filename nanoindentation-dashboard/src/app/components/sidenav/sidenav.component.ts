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
  uploadedFile: any = [];
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

  constructor(private graphService: GraphService,
              public processService: ProcessorService) {
  }

  ngOnInit() {
    this.filters = this.processService.availableProcesses.filters;
    this.consoleItems = []
  }

  uploadHandler(event: any): void {
    this.uploadedFile = event.files;
    this.parseData();
  }

  codeUploadHandler(event: any) {
    console.log("START UPLOADING")
    this.uploadedCode = event.files;
    console.log(this.uploadedCode)
  }

  parseData() {
    console.log("PARSE DATA")
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log("HERE");
      // Entire file
      const text: string = reader.result as string;
      // $output.innerText = text


      // By lines
      let lines = text.split('\n');
      let reached = false;
      let customerData = {
        "Name": [],
        "Time": [],
        "Load": [],
        "Indentation": [],
        "Cantilever": [],
        "Piezo": []
      };
      customerData["Name"].push(this.uploadedFile[0].name)

      let values;
      for (let line = 0; line < lines.length; line++) {
        if (reached) {
          //ta.push(lines[line].split("\t"));
          values = lines[line].split("\t");
          customerData["Time"].push(values[0]);
          customerData["Load"].push(values[1]);
          customerData["Indentation"].push(values[2]);
          customerData["Cantilever"].push(values[3]);
          customerData["Piezo"].push(values[4]);
        }

        let words = lines[line].split('');
        for (let word = 0; word < words.length; word++) {

          if (words.slice(-10).join("").trim() === "Auxiliary") {
            reached = true;
          }
        }
      }

      let dataset: Dataset


      // this.graphService.inputData.x = customerData["Indentation"];
      // this.graphService.inputData.y = customerData["Load"];
    }

    reader.readAsText(this.uploadedFile[0]);
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


