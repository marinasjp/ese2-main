import {EInputFieldType, Input} from '../models/input.model';
import {TestBed, async} from '@angular/core/testing';
import {EProcType} from 'src/app/models/process.model';
import {GraphService} from 'src/app/services/graph.service';
import {ProcessorService} from 'src/app/services/processor.service';
import {ErrorHandlerService} from 'src/app/services/error-handler.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {WrittenProcesses} from "../../environments/environment";
import {Dataset} from '../models/dataset.model';
import {CustomError} from '../models/error.model';
import {Datapoint} from '../models/datapoint.model';
import {loadPyodide} from "pyodide";

//import * as fs from 'fs';

let testProcess = {
  id: "testProcess",
  name: "Test",
  procType: EProcType.TEST,
  script: "def calculate( x, y): \n return x, y+1"
}
//let testFs = fs.readFileSync('../assets/Processes/Tests/testProcess.py', 'utf-8');
let testScript = "def calculate( x, y): \n return x, y+1"

let testData: { x: number[], y: number[] } = {x: [100, 200, 300, 400], y: [1, 2, 3, 4]};
let outData: { x: number[], y: number[] } = {x: [100, 200, 300, 400], y: [2, 3, 4, 5]};

let modelProcessDataSet = WrittenProcesses;
modelProcessDataSet.test.push(testProcess);


describe('ProcessorService', () => {


  let errorHandler = new ErrorHandlerService();
  let http: HttpClient;
  const graph = new GraphService(http);

  let process: ProcessorService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,

      ],
      providers: [
        GraphService,
        ErrorHandlerService,
        ProcessorService,
      ],
    });
  });


  // Tests if addProcess is ... adding a new python script (Process) to the data structure.
  it('Tests if addProcess ... returns dataset with a new Process added', () => { // maybe test if it is at the end?
    const service: ProcessorService = TestBed.get(ProcessorService);
    expect(service.addProcess(testProcess)).toEqual(modelProcessDataSet);
  });

  // Tests if getScript ... is returning the correct script when given a Process name and type.
  it('Tests if getScript ... is returning the correct script when given a Process name and type.', (done) => {

    const service: ProcessorService = TestBed.get(ProcessorService);
    let promise = service.getScript(testProcess);

    if (promise instanceof Promise<String>) {

      promise.then((result) => {
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
  it('Test if ... correct script is selected to run', (done) => {
    let service = new ProcessorService(http, errorHandler, graph); //declare new object because the constructor needs to run

    service.addProcess(testProcess);
    service.selectedTests = [testProcess];

    expect(service.selectedTests).toEqual([testProcess]);
    done()
  });

  it('Tests if ... pyodide runner is used', () => {

  })


  /*it('Test if ... Selected process runs on dataset',async()=>{
   let service = new ProcessorService(http, errorHandler, graph);
    let pyodide = await loadPyodide({
   indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
 });

   let testDataSet: Dataset = {
     contactPoint: null,
     displacementForceData : [],
     displacementForceFilteredData: [],
     indentationForceData: [],
     elspectraData : [],
     testData: [],
   };

   let testDataConverted: any = service.convertXAndYArrayToDatapointsArray(testData);
   if (typeof (testDataConverted) == 'object' && testDataConverted.error)
   {
     fail('Data conversion failed.');
   }
   testDataSet.testData = testDataConverted;
   let outDataConverted: any = service.convertXAndYArrayToDatapointsArray(outData);
   service.addProcess(testProcess);
   service.selectedTests = [testProcess];

   expect(service.testOutDatasets[0].testData).toEqual(outDataConverted);
  });*/

});
