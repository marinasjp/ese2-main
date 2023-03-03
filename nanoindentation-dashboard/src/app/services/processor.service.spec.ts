import {TestBed} from '@angular/core/testing';
import { EProcType } from 'src/app/models/process.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';
import * as fs from 'fs';

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
  let service: ProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return 1', () => { // maybe test if it is at the end?
    expect(service.addProcess(testProcess)).toBe(startPro);
});

// Tests if getScript ... is returning the correct script when given a Process name and type.
test('TesterProc should return func that adds 1 to dataset', () => {
    expect(service.getScript(testProcess)).toBe(testStr);
});

// Tests if doProces... is running on the given data set.
test('testing do process should return dataset with +1', () => {
    expect(service.doProcess(testProcess, testData)).toBe(outData);
});
});
