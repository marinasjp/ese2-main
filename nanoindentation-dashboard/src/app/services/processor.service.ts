import {Injectable} from '@angular/core';
import {EProcType, Process} from "../models/process.model";
import {loadPyodide} from "pyodide";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GraphService} from "./graph.service";
import {ErrorHandlerService} from "./error-handler.service";
import {Datapoint} from "../models/datapoint.model";
import {Dataset} from "../models/dataset.model";
import {CustomError} from '../models/error.model';

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  public pyodideInitialized: boolean = false;

  private _loading: BehaviorSubject<string[]>;

  public get loading$(): Observable<string[]> {
    return this._loading.asObservable();
  }

  public set loading(strings: string[]) {
    this._loading.next(strings);
    this.loading.forEach((string) => {
      console.log(string);
    })
  }

  public get loading(): string[] {
    return this._loading.value;
  }

  //Container for selected Filters
  private _selectedFilters: Process[] = []; 

  //getter for selected filters
  public get selectedFilters(): Process[] {
    return this._selectedFilters;
  }

  //setter for selected filters (also runs all filters)
  public set selectedFilters(filters: Process[]) {
    this._selectedFilters = filters;

    // whenever selected filters change: run runFilters() from the start (index 0)
    this.runFilters(0);
  }

  //container for selected Cpoint processes
  private _selectedCPointProcess: Process = null;

  //Setter for selected Cpoint process (also runs Cpoint process)
  public set selectedCPointProcess(process: Process) {
    this._selectedCPointProcess = process;
    this.calculateContactPoint();//when CPoint process is changed, calculate Cpoint
  }

  //Getter for selected Cpoint process
  public get selectedCPointProcess(): Process {
    return this._selectedCPointProcess;
  }

  //container for all available processes
  public availableProcesses: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[], internal: Process[], test: Process[] } = {
    filters: [ //Container for available filters
      {id: 'median', name: 'Median', procType: EProcType.FILTER, custom: false},
      {id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER, custom: false},
      {id: 'linearDetrend', name: 'Linear Detrending', procType: EProcType.FILTER, custom: false},
    ],
    cPoints: [//container for cPoints
      {id: 'rov', name: 'Rov', procType: EProcType.CPOINT, custom: false},
      {id: 'stepAndDrift', name: 'Step and Drift', procType: EProcType.CPOINT, custom: false}
    ],
    eModels: [],//container for eModel
    fModels: [],//container for fModel,
    internal: [
      {id: 'calc_indentation', name: 'Calculating Indentation', procType: EProcType.INTERNAL, custom: false}
    ], // container for processes only run by the app but not selectable by the user
    test: []     //container for test processess
  }

  public addProcess(process: Process) { //adds a process definition to the data struct
    try {
      switch (process.procType) { //add to the correct container acording to process type
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
          throw Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      return this.availableProcesses;
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //catch any errors
    }
  };

  private rootPath: string = 'assets/Processes/'; //path of process scripts

  private _processedData: { x: number[], y: number[] };//container for most recent processed dataset

  //getter for processed dataset
  public get processedData(): { x: number[], y: number[] } {
    return this._processedData;
  }

  //setter for processed dataset
  public set processedData(data: { x: number[], y: number[] }) {
    this._processedData = data;
  }

  //constructor for object
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private graphService: GraphService) {
    this._loading = new BehaviorSubject<string[]>(['Initializing pyodide...']);
    this.initPy();
  }

  async initPy() { //initialise Pyodide
    loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
      globalThis.pyodide = pyodide;
      this.loading = ['pyodide initialized ✔', 'Initializing numpy...'];
      globalThis.pyodide.loadPackage(['numpy']).then(() => {
        this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'Initializing scipy...'];
        globalThis.pyodide.loadPackage(['scipy']).then(() => {
          this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'scipy initialized ✔'];
          this.pyodideInitialized = true;
          this.loading = [];
        })
      })
    })
  }

  runFilters(filterIndex: number): any {

    if (this.selectedFilters.length == 0) {
      this.graphService.datasets.forEach((dataset: Dataset, index: number) => {
        this.graphService.datasets[index].displacementForceFilteredData = this.graphService.datasets[index].displacementForceData;
      })
    }

    if (this.selectedFilters.length - 1 >= filterIndex) {
      let currentFilter = this.selectedFilters[filterIndex];
      if (filterIndex == 0) {
        this.loading = ['Running Filter: ' + currentFilter.name + '...'];
      } else {
        this.loading.push('Running Filter: ' + currentFilter.name + '...');
      }

      let getScriptPromise: Promise<string> | CustomError = this.getScript(currentFilter);

      if (!(getScriptPromise instanceof Promise<string>)) {//if a promise is not returned
        this.runFilters(filterIndex + 1); //skip filter maybe??
        return getScriptPromise; //do smth to show that its an error
      }

      getScriptPromise.then((processScript) => {
        this.graphService.datasets.forEach((dataset: Dataset, index: number) => {
          let datapoints: Datapoint[];

          // if it's the first filter -> use unfiltered data
          if (filterIndex == 0) {
            datapoints = dataset.displacementForceData;
          } else {
            datapoints = dataset.displacementForceFilteredData;
          }

          datapoints = this.runProcessScriptOnDatapoints(datapoints, processScript) as Datapoint[];
          this.graphService.datasets[index].displacementForceFilteredData = datapoints;
        })

        // this.loadingStatus[this.loadingStatus.length - 1] = 'Finished Filter: ' + currentFilter.name + ' ✔';
        this.runFilters(filterIndex + 1);
      })

    } else {
      // this._loading.next(false);
      // this.loadingStatus = [];
      this.graphService.datasets = this.graphService.datasets;
      this.calculateContactPoint();
    }
  }

  calculateContactPoint() {
    // this._loading.next(true);

    if (!this.selectedCPointProcess) {
      // this._loading.next(false);
      // this.loadingStatus = [];
      return;
    }

    // this.loadingStatus[this.loadingStatus.length - 1] = 'Calculating Contactpoints using ' + this.selectedCPointProcess.name;

    let getScriptPromise: Promise<string> | CustomError = this.getScript(this.selectedCPointProcess);

    if (!(getScriptPromise instanceof Promise<string>)) {
      // TODO: ERROR HAPPENED
      return;
    }

    getScriptPromise.then((processScript) => {
      this.graphService.datasets.forEach((dataset: Dataset, index: number) => {
        let datapoint: Datapoint = this.runProcessScriptOnDatapoints(dataset.displacementForceFilteredData, processScript) as Datapoint;
        dataset.contactPoint = datapoint;
      })
      // this._loading.next(false);
      // this.loadingStatus = [];
      this.calculateIndentation();
    })
  }

  calculateIndentation() {
    // this._loading.next(true);
    // this.loadingStatus[this.loadingStatus.length - 1] = 'Calculating Indentation ...';

    let calcIndentationProcess: Process = this.availableProcesses.internal.find((process: Process) => {
      return process.id == 'calc_indentation';
    })
    let getScriptPromise: Promise<string> | CustomError = this.getScript(calcIndentationProcess);
    //
    if (!(getScriptPromise instanceof Promise<string>)) {
      // TODO: ERROR HAPPENED
      return;
    }

    getScriptPromise.then((processScript) => {
      this.graphService.datasets.forEach((dataset: Dataset, index: number) => {
        let contactPoint = [dataset.contactPoint.x, dataset.contactPoint.y];
        let datapoints: Datapoint[] = this.runProcessScriptOnDatapoints(dataset.displacementForceFilteredData, processScript, contactPoint) as Datapoint[];
        this.graphService.datasets[index].indentationForceData = datapoints;
      })
      // this._loading.next(false);
      // this.loadingStatus = [];
      this.graphService.datasets = this.graphService.datasets;
    })
  }


  //Uses the given process name and processes path to give the script
  // returns script or promise of script if successful, -1 if error occurred
  public getScript(process: Process): Promise<string> | CustomError {
    try {
      if (process.script) { //if process has a script recorded
        //get process from data sytem
        return new Promise((resolve) => {
          resolve(process.script); //return script as promise stored in process
        });
      }
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //fatal error if data system could be reached
    }

    let procPath = this.rootPath; //path to filesystem
    try {
      // If the process is not recorded, look for it:
      switch (process.procType) {
        case EProcType.CPOINT: {
          procPath += 'CPoints/'; //add relevant folder to path
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
        case EProcType.INTERNAL: {
          procPath += 'Internal/';
          break;
        }
        case EProcType.TEST: {
          procPath += 'Tests/';
          break;
        }
        default: {
          throw Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      procPath += process.id + '.py'; //add file name to path to get path to file
      return this.http.get(procPath, {responseType: 'text'}).toPromise(); //return as promise

    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //return error if caught
    }
  }

  runProcessScriptOnDatapoints(datapoints: Datapoint[], processScript: string, arg?: any): Datapoint[] | Datapoint {
    let convertedDataset: { x: number[], y: number[] } = this.convertDatapointsArrayToXAndYArray(datapoints);
    let xAxis = convertedDataset.x;
    let yAxis = convertedDataset.y;

    globalThis.pyodide.runPython(processScript); //Running the code
    let calculate = globalThis.pyodide.globals.get('calculate'); //map the function from the global variables onto 'calculate'

    let resultPy: any;

    if (arg) {
      resultPy = calculate(xAxis, yAxis, arg); //run function on the dataset
    } else {
      resultPy = calculate(xAxis, yAxis); //run function on the dataset
    }
    let result = resultPy.toJs(); //translate result to JS
    result = {x: result[0], y: result[1]}; //map result onto container
    if (result.x.length > 1 && result.y.length > 1) {
      result = this.convertXAndYArrayToDatapointsArray(result);
    } else {
      result = result as Datapoint
    }
    resultPy.destroy();//free the function used
    return result;
  }

  convertDatapointsArrayToXAndYArray(datapoints: Datapoint[]): { x: number[], y: number[] } {
    let x: number[] = [];
    let y: number[] = [];

    datapoints.forEach((datapoint: Datapoint) => {
      x.push(datapoint.x);
      y.push(datapoint.y);
    })

    return {x: x, y: y};
  }

  convertXAndYArrayToDatapointsArray(input: { x: number[], y: number[] }): Datapoint[] | Datapoint {
    let datapoints: Datapoint[] = [];

    if (input.x.length == input.y.length) {

      input.x.forEach((x: number, index: number) => {
        datapoints.push({x: input.x[index], y: input.y[index]})
      })
      return datapoints;
    }

    console.log('ERROR: X AND Y AXIS ARE NOT OF EQUAL LENGTH')
    return [];
  }

  runAll(processes: Process[]): any {

    if (processes.length == 0) { // base case
      // FINISHED
      console.log('FINISHED')
      this.loading = [];
      return;
    }

    let currentProcess = processes.shift(); // removes element from index 0 -> shifts everything to the left -> stores it in currentProcess

    let loadingMsgs: string[] = this.loading;
    loadingMsgs.push('Running ' + currentProcess.name + '...');
    this.loading = loadingMsgs;

    let getScriptPromise: Promise<string> | CustomError = this.getScript(currentProcess);

    if (!(getScriptPromise instanceof Promise<string>)) {//if a promise is not returned
      console.log('ERROR: Script could not be obtained')
      return getScriptPromise; //do smth to show that it's an error
    }

    getScriptPromise.then((processScript) => {

      this.graphService.datasets.forEach((dataset: Dataset, index: number) => {
        let inputDatapoints: Datapoint[];

        switch (currentProcess.procType) {
          case EProcType.FILTER || EProcType.CPOINT || EProcType.INTERNAL:
            inputDatapoints = dataset.displacementForceFilteredData;
            break;
          case EProcType.EMODELS || EProcType.FMODELS:
            inputDatapoints = dataset.indentationForceData;
            break;
        }

        let outputDatapoints = this.runProcessScriptOnDatapoints(inputDatapoints, processScript);

        switch (currentProcess.procType) {
          case EProcType.FILTER:
            this.graphService.datasets[index].displacementForceFilteredData = outputDatapoints as Datapoint[];
            break;
          case EProcType.CPOINT:
            this.graphService.datasets[index].contactPoint = outputDatapoints as Datapoint;
            break;
          case EProcType.INTERNAL:
            this.graphService.datasets[index].indentationForceData = outputDatapoints as Datapoint[];
            break;
          case EProcType.EMODELS:
            // TODO: IMPLEMENT
            break;
          case EProcType.FMODELS:
            // TODO: IMPLEMENT
            break;
        }

        loadingMsgs[loadingMsgs.length] = currentProcess.name + ' done ✔'
        this.runAll(processes); // recursive call
      })
    })
  }
    
  //Runs all the processes from (and including) the process type specified
  public runFrom(procType: EProcType): void | CustomError {
    try {
      let processChain: Process[] = [];
      switch (procType) { //append relevant containers to processChain according to which type is selected
        //@ts-expect-error
        case EProcType.FILTER: {
          if(!this.selectedFilters.length){break;}//break out of switch if empty
          processChain = processChain.concat(this.selectedFilters); //append to chain
        } //fallthrough to the next procType
        //@ts-expect-error
        case EProcType.CPOINT: {
          if(!this.selectedCPointProcess){break;}
          processChain = processChain.concat(this.selectedCPointProcess);
        }
        //@ts-expect-error
        case EProcType.INTERNAL: {
          if(!this.availableProcesses.internal.length){break;}
          processChain = processChain.concat(this.availableProcesses.internal);
        }
        //@ts-expect-error
        case EProcType.EMODELS: {
          //if(!this.selectedEmodels.length){break;}
          //processChain = processChain.concat(this.selectedEmodels);
        }
        //@ts-expect-error
        case EProcType.FMODELS: {
          //if(!this.selectedFmodels.length){break;}
          //processChain = processChain.concat(this.selectedFmodels);
        }
        //@ts-expect-error
        case EProcType.TEST: {
          //if(!this.selectedTests.length){break;}
          //processChain = processChain.concat(this.selectedTests);
        }
        default: {
          throw Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      this.runAll(processChain);

    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //catch any errors as fatal errors
    }
  }
}
