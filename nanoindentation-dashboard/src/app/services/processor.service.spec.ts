import {NgModule} from '@angular/core';
import {TestBed, async} from '@angular/core/testing';
import { EProcType } from 'src/app/models/process.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SampleDataService } from 'src/app/services/sample-data.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
//import * as fs from 'fs';

let testProcess = {id:"test", name: "Test", procType: EProcType.TEST}
//let testStr = fs.readFileSync('../assets/Processes/Tests/testProcess.py', 'utf-8');
let testStr = "def calculate( x, y): \n return x, y+1"
let startPro = {
                filters: [ //container for filters
                { id: 'median', name: 'Median', procType: EProcType.FILTER, custom: false },
                { id: 'savgol', name: 'Sawitzky Golay', procType: EProcType.FILTER, custom: false },
                { id: 'linearDetrend', name: 'Linear Detrending', procType: EProcType.FILTER, custom: false },
                ],
                cPoints: [],//container for cPoints
                eModels: [],//container for eModel
                fModels: [],//container for fModel
                test: [     //container for test processess
                    {id:"testProcess", name: "Test", procType: EProcType.TEST}
                ]
            }
    let testData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [1, 2, 3, 4] };
    let outData: { x: number[], y: number[] } = { x: [100, 200, 300, 400], y: [2, 3, 4, 5] };



  describe('ProcessorService', () => {

   
    let errorHandler = new ErrorHandlerService();
    let sample = new SampleDataService();
    let http: HttpClient;
    let graph = new GraphService(sample, http);

    let process: ProcessorService;

    beforeEach(async() => {
        //mockProcessorService = new ProcessorService(http, errorHandler, new GraphService(sample, http));
        
       /* TestBed.configureTestingModule({
          declarations: [
          ],
          providers: [
            GraphService, 
            ErrorHandlerService, 
            SampleDataService,
            ProcessorService
          ],
       }).compileComponents();*/
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


    // Tests if the newProcess function is ... a new python script (Process) is added to the data structure.
    it('should return 1', () => { // maybe test if it is at the end?
      const service: ProcessorService = TestBed.get(ProcessorService);
      expect(service.addProcess(testProcess)).toBe(startPro);
    });

    // Tests if getScript ... is returning the correct script when given a Process name and type.
    it('TesterProc should return func that adds 1 to dataset', () => {
      const service: ProcessorService = TestBed.get(ProcessorService);
      expect(service.getScript(testProcess)).toBe(testStr);
     });

    // Tests if doProces... is running on the given data set.
    it('testing do process should return dataset with +1', () => {
      const service: ProcessorService = TestBed.get(ProcessorService);
      expect(service.doProcess(testProcess, testData)).toBe(outData);
    });
});
