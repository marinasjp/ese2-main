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
import {EInputFieldType, Input} from '../models/input.model';

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  showReCalculateButton: boolean = false;

  private _loading: BehaviorSubject<string[]>;

  public get loading$(): Observable<string[]> {
    return this._loading.asObservable();
  }

  public set loading(strings: string[]) {
    this._loading.next(strings);
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

    this.loading = ['Resetting filters'];
    // RESET FILTERED DATA
    this.graphService.selectedDatafile.datasets.forEach((dataset: Dataset, index: number) => {
      this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = this.graphService.selectedDatafile.datasets[index].displacementForceData;
    })
    this.graphService.selectedDatafile = this.graphService.selectedDatafile;
    this.loading = ['Filters reset ✔']

    // whenever selected filters change: run runFilters() from the start (index 0)
    this.runFrom(EProcType.FILTER);
  }

  //container for selected Cpoint processes
  private _selectedCPointProcess: Process = null;

  //Setter for selected Cpoint process (also runs Cpoint process)
  public set selectedCPointProcess(process: Process) {
    this._selectedCPointProcess = process;
    this.runFrom(EProcType.CPOINT);//when CPoint process is changed, calculate Cpoint
  }

  //Getter for selected Cpoint process
  public get selectedCPointProcess(): Process {
    return this._selectedCPointProcess;
  }

  //container for selected Emodel processes
  private _selectedEmodels: Process = null;

  //Setter for selected Emodel process (also runs Emodel process)
  public set selectedEmodels(process: Process) {
    this._selectedCPointProcess = process;
    this.runFrom(EProcType.EMODELS);//when Emodel process is changed, calculate Emodel
  }

  //Getter for selected Emodels process
  public get selectedEmodels(): Process {
    return this._selectedEmodels;
  }

  //container for selected Fmodels processes
  private _selectedFmodels: Process = null;

  //Setter for selected Fmodels process (also runs Fmodels process)
  public set selectedFmodels(process: Process) {
    this._selectedCPointProcess = process;
    this.runFrom(EProcType.FMODELS);//when Fmodels process is changed, calculate Fmodels
  }

  //Getter for selected Fmodels process
  public get selectedFmodels(): Process {
    return this._selectedFmodels;
  }

  //container for all available processes
  public availableProcesses: { filters: Process[], cPoints: Process[], eModels: Process[], fModels: Process[], internal: Process[], test: Process[] } = {
    filters: [ //Container for available filters
      {
        id: 'prominence',
        name: 'Prominence',
        procType: EProcType.FILTER,
        custom: false,
        inputs: [
          {name: 'Band [% preak pos]', type: EInputFieldType.NUMBER, selectedValue: 30},
          {name: 'Pro', type: EInputFieldType.NUMBER, selectedValue: 40},
          {name: 'Threshold', type: EInputFieldType.NUMBER, selectedValue: 25}
        ]
      },
      {id: 'median', name: 'Median', procType: EProcType.FILTER, custom: false, inputs: null},
      {id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER, custom: false, inputs: null}
    ],
    cPoints: [//container for cPoints
      {id: 'rov', name: 'Rov', procType: EProcType.CPOINT, custom: false, inputs: null},
      {id: 'stepAndDrift', name: 'Step and Drift', procType: EProcType.CPOINT, custom: false, inputs: null}
    ],
    eModels: [],//container for eModel
    fModels: [],//container for fModel,
    internal: [
      {
        id: 'calc_indentation', name: 'Calculating Indentation', procType: EProcType.INTERNAL, custom: false,
        inputs:
          [ //container for required user inputs
            {name: "CP", selectedValue: null, type: EInputFieldType.DATAPOINT},
            {name: "spring_constant", selectedValue: 1, type: EInputFieldType.NUMBER},
            {name: "setzeroforce", selectedValue: true, type: EInputFieldType.BOOLEAN}
          ]
      },
      {
        id: 'calc_elspectra', name: 'Calculating ElSpectra', procType: EProcType.INTERNAL, custom: false,
        inputs:
          [ //container for required user inputs
            {name: "Tip Geometry", selectedValue: true, type: EInputFieldType.GEOMETRY},
            {name: "Radius", selectedValue: 1, type: EInputFieldType.NUMBER},
            {name: "Win", selectedValue: 100, type: EInputFieldType.NUMBER},
            {name: "Order", selectedValue: 2, type: EInputFieldType.NUMBER},
            {name: "Use Interpolation", selectedValue: false, type: EInputFieldType.BOOLEAN}
          ] // defaults: geometry='cylinder', radius=1, win=100, order=2, interp=False
      }
    ], // container for processes only run by the app but not selectable by the user
    test: []     //container for test processess
  }

  public addProcess(process: Process) { //adds a process definition to the data struct
    try {
      switch (process.procType) { //add to the correct container acording to process type
        case EProcType.CPOINT: {
          console.log("CPoint");
          this.availableProcesses.cPoints.push(process);
          break;
        }
        case EProcType.FILTER: {
          console.log("Filter");
          this.availableProcesses.filters.push(process);
          break;
        }
        case EProcType.EMODELS: {
          console.log("EModel");
          this.availableProcesses.eModels.push(process);
          break;
        }
        case EProcType.FMODELS: {
          console.log("FModel");
          this.availableProcesses.fModels.push(process);
          break;
        }
        case EProcType.TEST: {
          this.availableProcesses.test.push(process);
          break;
        }
        default: {
          console.log("Could not find type");
          // this.graphService.showErrorDialog("Could not find Process Type");
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
    try {
      loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
        globalThis.pyodide = pyodide;
        this.loading = ['pyodide initialized ✔', 'Initializing numpy...'];
        globalThis.pyodide.loadPackage(['numpy']).then(() => {
          this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'Initializing scipy...'];
          globalThis.pyodide.loadPackage(['scipy']).then(() => {
            this.loading = ['pyodide initialized ✔', 'numpy initialized ✔', 'scipy initialized ✔'];
            this.loading = [];
          })
        })
      })
    } catch (e: any) {
      this.errorHandlerService.Fatal(e); // catch error
    }
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

  //given a list of processes, recursively runs them and stores the output in graphs
  runAll(processes: Process[]): any {

    if (processes.length == 0) { // base case
      // FINISHED
      this.loading = [];
      return;
    }

    let currentProcess = processes.shift(); // removes element from index 0 -> shifts everything to the left -> stores it in currentProcess

    let loadingMsgs: string[] = this.loading;//add loading message
    loadingMsgs.push('Running ' + currentProcess.name + '...');
    this.loading = loadingMsgs;

    let getScriptPromise: Promise<string> | CustomError = this.getScript(currentProcess); //get script of process

    if (!(getScriptPromise instanceof Promise<string>)) {//if a promise is not returned
      console.log('ERROR: Script could not be obtained');
      return getScriptPromise; //do smth to show that it's an error
    }

    getScriptPromise.then((processScript) => {

      this.graphService.selectedDatafile.datasets.forEach((dataset: Dataset, index: number) => {
        let inputDatapoints: Datapoint[] = [];

        //select datapoints to be processed depending on type of process
        switch (currentProcess.procType) {
          case EProcType.FILTER:
            inputDatapoints = dataset.displacementForceFilteredData;
            break;
          case EProcType.CPOINT:
            inputDatapoints = dataset.displacementForceFilteredData;
            break;
          case EProcType.INTERNAL:
            if (currentProcess.id == 'calc_indentation') {
              inputDatapoints = dataset.displacementForceFilteredData;
              currentProcess.inputs[0].selectedValue = dataset.contactPoint; //set CP in dataset to be the value

              /*inputArgs.push(dataset.contactPoint.x);
                inputArgs.push(dataset.contactPoint.y);*/
            } else if (currentProcess.id == 'calc_elspectra') {
              inputDatapoints = dataset.displacementForceFilteredData;
            }
            break;
          case EProcType.EMODELS:
            inputDatapoints = dataset.indentationForceData;
            break;
          case EProcType.FMODELS:
            inputDatapoints = dataset.indentationForceData;
            break;
        }

        let inputArgs: any = currentProcess?.inputs?.map(input => {
          if (input.type == EInputFieldType.DATAPOINT) {
            return [input.selectedValue.x, input.selectedValue.y] //convert Datapoint type to x and y array
          }
          return input.selectedValue
        }); //map selected values onto inputarg

        //INPUT CHECKING
        if (currentProcess?.inputs?.length) { //if there are user inputs required check for null
          inputArgs.forEach((input: any) => {
            if (!input) { //if an input is set to be null and there are user inputs specified
              return this.errorHandlerService.Fatal(Error("InputError: input not given"));
            }
            return 0;
          })
        }

        //run process on input datapoints
        let outputDatapoints: any;
        if (inputArgs?.length) {
          outputDatapoints = this.runProcessScriptOnDatapoints(inputDatapoints, processScript, inputArgs);
        } else {
          outputDatapoints = this.runProcessScriptOnDatapoints(inputDatapoints, processScript);
        }

        //set dataset being displayed according to the type of process that was run
        switch (currentProcess.procType) {
          case EProcType.FILTER:
            this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = outputDatapoints as Datapoint[];
            break;
          case EProcType.CPOINT:
            this.graphService.selectedDatafile.datasets[index].contactPoint = outputDatapoints as Datapoint;
            break;
          case EProcType.INTERNAL:
            if (currentProcess.id == 'calc_indentation') {
              this.graphService.selectedDatafile.datasets[index].indentationForceData = outputDatapoints as Datapoint[];
            } else if (currentProcess.id == 'calc_elspectra') {
              this.graphService.selectedDatafile.datasets[index].elspectraData = outputDatapoints as Datapoint[];
            }
            break;
          case EProcType.EMODELS:
            // TODO: IMPLEMENT
            break;
          case EProcType.FMODELS:
            // TODO: IMPLEMENT
            break;
        }
      })

      //change loading msg
      this.graphService.selectedDatafile = this.graphService.selectedDatafile;
      loadingMsgs[loadingMsgs.length - 1] = currentProcess.name + ' done ✔'
      this.runAll(processes); // recursive call
    })
    this.showReCalculateButton = false;
  }

  //Runs all the processes from (and including) the process type specified
  public runFrom(procType: EProcType): void | CustomError {
    this.loading = ['Creating Process Chain'];

    try {
      let processChain: Process[] = [];
      switch (procType) { //append relevant containers to processChain according to which type is selected
        //@ts-expect-error
        case EProcType.FILTER: {
          processChain = processChain.concat(this.selectedFilters); //append to chain
        } //fallthrough to the next procType
        //@ts-expect-error
        case EProcType.CPOINT: {
          if (!this.selectedCPointProcess) {//if there are no selected process of the type
            break;  //skip
          }
          processChain.push(this.selectedCPointProcess);
        }
        //@ts-expect-error
        case EProcType.INTERNAL: {
          if (!this.availableProcesses.internal.length) {
            break;
          }
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
        case EProcType.TEST: {
          //if(!this.selectedTests.length){break;}
          //processChain = processChain.concat(this.selectedTests);
          break;
        }
        default: {
          throw Error('ERROR: ProcType error'); //throw error if type isnt found
        }
      }
      this.runAll(processChain); //runs the whole chain
    } catch (e: any) {
      return this.errorHandlerService.Fatal(e); //catch any errors as fatal errors
    }
  }
}
