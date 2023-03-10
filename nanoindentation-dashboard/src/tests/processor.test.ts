import { EProcType } from '../app/models/process.model';
import { GraphService } from '../app/services/graph.service';
import { ProcessorService } from '../app/services/processor.service';
import * as fs from 'fs';
import { ErrorHandlerService } from '../app/services/error-handler.service';
import { SampleDataService } from '../app/services/sample-data.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

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

//Mock the Processor object to use it in testing

 describe('ProcessorService', () => {

    let mockProcessorService: ProcessorService;
    let errorHandler = new ErrorHandlerService();
    let sample = new SampleDataService();
    let http: HttpClient;
    let graph = new GraphService(sample, http);

    beforeEach(() => {
        mockProcessorService = new ProcessorService(http, errorHandler, new GraphService(sample, http));
    });

    // Tests if the newProcess function is ... a new python script (Process) is added to the data structure.
    test('should return 1', () => { // maybe test if it is at the end?
        expect(mockProcessorService.addProcess(testProcess)).toBe(startPro);
    });

    // Tests if getScript ... is returning the correct script when given a Process name and type.
    test('TesterProc should return func that adds 1 to dataset', () => {
        expect(mockProcessorService.getScript(testProcess)).toBe(testStr);
     });

    // Tests if doProces... is running on the given data set.
    test('testing do process should return dataset with +1', () => {
        expect(mockProcessorService.doProcess(testProcess, testData)).toBe(outData);
    });
});
