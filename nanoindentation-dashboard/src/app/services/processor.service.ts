import {Injectable} from '@angular/core';
import {EProcType, Process} from "../models/process.model";

const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.22.0/full/';
//declare let loadPyodide: any;
import {loadPyodide} from "pyodide";

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {
  processes: Process[] //Registered processes dict
  processChain: Process[] //Processes being applied
  currData: {} //Current dataset dict

  constructor() {
    this.loadPy();
  }

  async loadPy() {
    loadPyodide({indexURL: PYODIDE_BASE_URL}).then((pyodide) => {
      globalThis.pyodide = pyodide;
      console.log(globalThis.pyodide);
      console.log('pyodide loaded');
    })
  }

  start() {
    let procPath = ".\Processes"
  }

  //Uses the given process name and processes path to give the script
  ///// returns void if successful, errorMsgString if error occurred
  getScript(procName: string, procType: EProcType): void | string {
    //find process in dict of known processes
    let typeProcs = this.processes.filter((p) => {
      return p.procType == procType;
    });

    if (typeProcs == null) {
      //  ProcType error
      return 'ERROR: ProcType error';
    }

    let script = typeProcs[procName];
    if (script == null) {
      return 'ERROR: Script Error'
    }
    return script;
  }

  //Takes a script and uses pyodide to run it on the dataSet
  doProcess(procName: string, procType: EProcType, dataSet: any = this.currData) {
    const procScript = this.getScript(procName, procType); //get the process script

    let out = [] = [];

    globalThis.pyodide.languagePluginLoader.then(function () { //initialize pyodide
      console.log(this.pyodide.runPython(`
                import sys
                sys.version
            `));

      console.log(globalThis.pyodide.runPython(procScript)); //run proc script
      let calculate = globalThis.pyodide.globals.get('calculate'); //map calculate method onto js function
      out = calculate(dataSet);
      calculate.destroy(); //release memory
    });
  }

  newProcessfunction(procName, procType, procScript) {
    this.processes[procType][procName] = procScript //Adds Script to recognised scripts
    return;
  }
}
