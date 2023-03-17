import { EInputFieldType, Input } from '../models/input.model';
import {TestBed, async} from '@angular/core/testing';
import { EProcType } from 'src/app/models/process.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SampleDataService } from 'src/app/services/sample-data.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {WrittenProcesses} from "../../environments/environment";

//import * as fs from 'fs';

let testProcess = {id:"testProcess", name: "Test", procType: EProcType.TEST, script:"def calculate( x, y): \n return x, y+1"}
//let testFs = fs.readFileSync('../assets/Processes/Tests/testProcess.py', 'utf-8');
let testScript = "def calculate( x, y): \n return x, y+1"


let testData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [1, 2, 3, 4] };
let outData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [2, 3, 4, 5] };

let modelProcessDataSet = WrittenProcesses;
modelProcessDataSet.test.push(testProcess);


  describe('ProcessorService', () => {

   
    let errorHandler = new ErrorHandlerService();
    let sample = new SampleDataService();
    let http: HttpClient;
    let graph = new GraphService(sample, http);

    let process: ProcessorService;

    beforeEach(async() => {
        
       TestBed.configureTestingModule({
        imports:[
          HttpClientTestingModule
        ],
        providers: [
          GraphService, 
          ErrorHandlerService, 
          SampleDataService,
          ProcessorService
        ],
       });

       process = new ProcessorService(http, errorHandler, graph);
    });


    // Tests if addProcess is ... adding a new python script (Process) to the data structure.
    it('Tests if addProcess ... returns dataset with a new Process added', () => { // maybe test if it is at the end?
      const service: ProcessorService = TestBed.get(ProcessorService);
      expect(service.addProcess(testProcess)).toEqual(modelProcessDataSet);
    });

    // Tests if getScript ... is returning the correct script when given a Process name and type.
    it('Tests if getScript ... is returning the correct script when given a Process name and type.', (done)=> {
    
      const service: ProcessorService = TestBed.get(ProcessorService);
      let promise = service.getScript(testProcess);

      if (promise instanceof Promise<String>){
        
        promise.then((result) =>{
          expect(result).toEqual(testScript);
          done();
        })
      }
     });


     //Test if getScript ... can grab process from the file system
     it('Test if getScript ... can grab process from the file system.', () => {
      const service: ProcessorService = TestBed.get(ProcessorService);
      //figure out how to use fs from angular
     });

     //Test if ... Pyodide, NumPy and SciPy have been loaded
     it('Test if ... Pyodide, NumPy and SciPy have been loaded', () => {
      const spy = spyOn(ProcessorService.prototype, 'initPy').and.stub();
      const service = new ProcessorService(http, errorHandler, graph);

      expect(spy).toHaveBeenCalledTimes(1);
     }); 

     // Test if script executes
     it('Test Script Execution', (done) => {
      console.log("Pyodide Test...")
      let service = new ProcessorService(http, errorHandler, graph);
      let testDataConverted = service.convertXAndYArrayToDatapointsArray(testData)
      let outDataConverted = service.convertXAndYArrayToDatapointsArray(outData);

      console.log("Adding process..")
      service.addProcess(testProcess);

      //const resultData = service.runProcessScriptOnDatapoints(testDataConverted, testScript);
      //expect(resultData).toEqual(outDataConverted);
      done()
      //expect(service.runProcessScriptOnDatapoints(testDataConverted, testScript)).toEqual(outDataconverted);

     });
    
});
