import {Injectable} from '@angular/core';
import {EProcType, Process} from "../models/process.model";
//declare let loadPyodide: any;
import {loadPyodide} from "pyodide";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GraphService} from "./graph.service";

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

  availableFilters: Process[] = [
    {id: 'median', name: 'Median', procType: EProcType.FILTER},
    {id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER},
    {id: 'linearDetrend', name: 'Linear Detrending', procType: EProcType.FILTER},
  ]

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

  initialData: { x: number[], y: number[] } = {x: [100, 200, 300, 400], y: [1, 2, 3, 4]};
  rootPath: string = 'assets/Processes/';

  constructor(private http: HttpClient,
              private graphService: GraphService) {
    this._pyodideInitalized = new BehaviorSubject<boolean>(true);
    this._pyodideLoading = new BehaviorSubject<boolean>(true);
    this.initPy();
  }

  async initPy() {
    loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
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

  runProcessChain() {
    if (this.processChain.filters.length) {
      this.updateFilteredDataset(this.initialData.x, this.initialData.y);
      this.runFilters();
    }
  }

  updateFilteredDataset(x: number[], y: number[]) {
    let filteredData = this.graphService.filteredData;
    console.log(filteredData);
    filteredData.x = x;
    filteredData.y = y;
    this.graphService.filteredData = filteredData;
    console.log(x);
    console.log(y);
  }

  runFilters(index: number = 0, dataSet: any = this.initialData): any {
    let promise = this.doProcess(this.processChain.filters[index], dataSet);
    if (typeof promise == 'string') {
      return promise;
    } else {
      promise = promise as Promise<any>;
      promise.then(result => {
        if (index < this.processChain.filters.length - 1) {
          this.runFilters(index + 1, result);
        } else {
          this.updateFilteredDataset(result.x, result.y);
        }
      })
    }
  }

  //Uses the given process name and processes path to give the script
  ///// returns void if successful, errorMsgString if error occurred
  getScript(process: Process): Promise<void | string> | string {

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
        procPath += 'EModels./';
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

    return this.http.get(procPath, {responseType: 'text'}).toPromise();
  }

  //Takes a script and uses pyodide to run it on the dataSet
  //procName: Name of proces, procType: Type of process, dataSet: (optional) dataset to be processed if not given uses this.currData
  doProcess(process: Process, dataSet: any = this.initialData): any {
    this._pyodideLoading.next(true); //check if pyodide is loaded


    let getScriptPromise: Promise<string | void> | string = this.getScript(process); //get the process script

    if (typeof getScriptPromise == "string") {
      return getScriptPromise;
    }

    return new Promise<any>((resolve, reject) => {
      getScriptPromise = getScriptPromise as Promise<string | void>;
      getScriptPromise
        .finally(() => {
          this._pyodideLoading.next(false)
        })
        .then(procScript => {
          globalThis.pyodide.runPython(procScript);
          let calculate = globalThis.pyodide.globals.get('calculate');
          let resultPy = calculate(dataSet.x, dataSet.y);
          let result = resultPy.toJs();
          result = {x: result[0], y: result[1]};
          resultPy.destroy();
          resolve(result);
        })
    })
  }
}
