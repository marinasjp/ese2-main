import {Injectable} from '@angular/core';
import {EProcType, Process} from "../models/process.model";
//declare let loadPyodide: any;
import {loadPyodide} from "pyodide";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {

  private _loadingPyodide: BehaviorSubject<boolean>;

  public get loadingPyodide$(): Observable<boolean> {
    return this._loadingPyodide.asObservable();
  }


  processes: Process[] //Registered processes dict
  processChain: Process[] //Processes being applied
  currData: {} //Current dataset dict

  rootPath: string = 'assets/Processes/';

  constructor(private http: HttpClient) {
    this.loadPy();
    this._loadingPyodide = new BehaviorSubject<boolean>(true);
  }

  async loadPy() {
    loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
      globalThis.pyodide = pyodide;
      console.log(globalThis.pyodide);
      console.log('pyodide loaded');
      globalThis.pyodide.loadPackage(['numpy']).then(() => {
        this._loadingPyodide.next(false);
      })
    })
  }

  start() {
     this.http.get(this.rootPath + 'CPoint/rov.py', {responseType: 'text'})
       .subscribe(data => console.log(data));
    return this.processes
  }

  //Uses the given process name and processes path to give the script
  ///// returns void if successful, errorMsgString if error occurred
  getScript(procName: string, procType: EProcType): Promise<void | string> | string {

    let procPath = this.rootPath;

    switch (procType) {
      case EProcType.CPOINT: {
        procPath += 'CPoint/';
        break;
      }
      case EProcType.TEST: {
        procPath += 'Test/';
        break;
      }
      default: {
        return 'ERROR: ProcType error'
      }
    }

    procPath += procName;

    return this.http.get(procPath, {responseType: 'text'}).toPromise();
  }

  //Takes a script and uses pyodide to run it on the dataSet
  doProcess(procName: string, procType: EProcType, dataSet: any = this.currData): any {
    this._loadingPyodide.next(true);

    let getScriptPromise: Promise<string | void> | string = this.getScript(procName, procType); //get the process script

    if (typeof getScriptPromise == "string") {
      return getScriptPromise;
    }

    getScriptPromise = getScriptPromise as Promise<string | void>;

    getScriptPromise
      .finally(() => {
        this._loadingPyodide.next(false)
      })
      .then(procScript => {
        let out;

        globalThis.pyodide.runPython(procScript);
        let calculate = globalThis.pyodide.globals.get('calculate');
        console.log(dataSet);
        out = calculate(dataSet.x, dataSet.y);
        console.log(out);

        calculate.destroy();
        return out;
      })

  }

  newProcessfunction(procName, procType, procScript) {
    this.processes[procType][procName] = procScript //Adds Script to recognised scripts
    return;
  }
}
