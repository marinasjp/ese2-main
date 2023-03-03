import { Injectable } from '@angular/core';
import { EProcType, Process } from "../models/process.model";
import { loadPyodide } from "pyodide";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GraphService } from "./graph.service";

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  private _pyodideInitalized: BehaviorSubject<boolean>;

  public get pyodideInitalized$(): Observable<boolean> {
    return this._pyodideInitalized.asObservable();
  }

  pyodideInitializationStatus: string = 'Initializing pyodide...'

  private _pyodideLoading: BehaviorSubject<boolean>;

  public get pyodideLoading$(): Observable<boolean> {
    return this._pyodideLoading.asObservable();
  }

  private _processChain: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[] } = {
    filters: [],
    cPoints: [],
    eModels: [],
    fModels: []
  };

  private get processChain(): { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[] } {
    return this._processChain;
  }

  private set processChain(processChain: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[] }) {
    this._processChain = processChain;
    this.runProcessChain();
  }

  private availableProcesses: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[], test: Process[] } = {
    filters: [ //container for processes
      { id: 'median', name: 'Median', procType: EProcType.FILTER, custom: false },
      { id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER, custom: false },
      { id: 'linearDetrend', name: 'Linear Detrending', procType: EProcType.FILTER, custom: false },
    ],
    cPoints: [],//container for cPoints
    eModels: [],//container for eModel
    fModels: [],//container for fModel
    test: []     //container for test processess
  }

  public addProcess(process: Process) {
    switch(process.procType){
      case EProcType.CPOINT: {
        this.availableProcesses.cPoints.push(process);
        break;
      }
      case EProcType.FILTER: {
        this.availableProcesses.filters.push(process);
        break;
      }
      case EProcType.EMODELS: {
        this.availableProcesses.eModels.push(process);
        break;
      }
      case EProcType.FMODELS: {
        this.availableProcesses.fModels.push(process);
        break;
      }
      case EProcType.TEST: {
        this.availableProcesses.test.push(process);
        break;
      }
      default: {
        return 'ERROR: ProcType error'
      }
    }
    return this.availableProcesses;
  };

  private _selectedFilters: Process[] = [];

  public get selectedFilters(): Process[] {
    return this._selectedFilters;
  }

  public set selectedFilters(filters: Process[]) {
    this._selectedFilters = filters;
    let processChain = this.processChain;
    processChain.filters = filters;
    this.processChain = processChain;
  }

  initialData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [1, 2, 3, 4] };
  rootPath: string = 'assets/Processes/';

  constructor(private http: HttpClient,
    private graphService: GraphService) {
    this._pyodideInitalized = new BehaviorSubject<boolean>(true);
    this._pyodideLoading = new BehaviorSubject<boolean>(true);
    this.initPy();
  }

  async initPy() { //initialise Pyodide
    loadPyodide({ indexURL: PYODIDE_BASE_URL }).then((pyodide) => {
      globalThis.pyodide = pyodide;
      this.pyodideInitializationStatus = 'pyodide initialized ✔<br>Initializing numpy...'
      globalThis.pyodide.loadPackage(['numpy']).then(() => {
        this.pyodideInitializationStatus = 'pyodide initialized ✔<br>numpy initialized ✔<br>Initializing scipy...'
        globalThis.pyodide.loadPackage(['scipy']).then(() => {
          this.pyodideInitializationStatus = 'pyodide initialized ✔<br>numpy initialized ✔<br>scipy initialized ✔'
          this._pyodideInitalized.next(false);
          this._pyodideLoading.next(false);
        })
      })
    })
  }

  //run the process chain recorded
  runProcessChain() {
    if (this.processChain.filters.length) {
      this.updateFilteredDataset(this.initialData.x, this.initialData.y);
      this.runFilters();
    }
  }

  //Update dataset in graphservice
  updateFilteredDataset(x: number[], y: number[]) {
    let filteredData = this.graphService.graphData;
    console.log(filteredData);
    filteredData.x = x;
    filteredData.y = y;
    this.graphService.graphData = filteredData;
    console.log(x);
    console.log(y);
  }

  runFilters(index: number = 0, dataSet: any = this.initialData): any {
    let promise = this.doProcess(this.processChain.filters[index], dataSet);
    if (typeof promise == 'string') {
      return promise;
    } else {
      promise = promise as Promise<any>;
      promise.then((result: { x: number[]; y: number[]; }) => {
        if (index < this.processChain.filters.length - 1) {
          this.runFilters(index + 1, result);
        } else {
          this.updateFilteredDataset(result.x, result.y);
        }
      })
    }
  }

  //Uses the given process name and processes path to give the script
  // returns script or promise of script if successful, -1 if error occurred
  getScript(process: Process): Promise<string> | string {

    if (process.script) { //if process has a script recorded
      //get process from data sytem
      return process.script; //return script stored in process
    }

    let procPath = this.rootPath;

    switch (process.procType) {
      case EProcType.CPOINT: {
        procPath += 'CPoints/';
        break;
      }
      case EProcType.FILTER: {
        procPath += 'Filters/';
        break;
      }
      case EProcType.EMODELS: {
        procPath += 'EModels/';
        break;
      }
      case EProcType.FMODELS: {
        procPath += 'FModels/';
        break;
      }
      case EProcType.TEST: {
        procPath += 'Tests/';
        break;
      }
      default: {
        return 'ERROR: ProcType error'
      }
    }

    procPath += process.name + '.py';
    let promiseScript = this.http.get(procPath, { responseType: 'text' }).toPromise();
    return promiseScript;
  }

  //Takes a script and uses pyodide to run it on the dataSet
  //procName: Name of proces, procType: Type of process, dataSet: (optional) dataset to be processed if not given uses this.currData
  doProcess(process: Process, dataSet: any = this.initialData): any {
    this._pyodideLoading.next(true); //check if pyodide is loaded
    
    let getScriptPromise: Promise<string> | string = this.getScript(process); //get the process script

    return new Promise<any>((resolve, reject) => {
      getScriptPromise = getScriptPromise as Promise<string>;
      getScriptPromise
        .finally(() => {
          this._pyodideLoading.next(false)
        })
        .then(procScript => {
          process.script = procScript;
          globalThis.pyodide.runPython(procScript);
          let calculate = globalThis.pyodide.globals.get('calculate');
          let resultPy = calculate(dataSet.x, dataSet.y);
          let result = resultPy.toJs();
          result = { x: result[0], y: result[1] };
          resultPy.destroy();
          resolve(result);
        })
    })
  }
}
