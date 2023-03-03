import { EProcType } from '../app/models/process.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from '../app/services/processor.service';
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

export class processorTest {
    constructor(private processorService: ProcessorService) {}

    
        describe(){
        // Tests if the newProcess function is ... a new python script (Process) is added to the data structure.
        test('should return 1', () => { // maybe test if it is at the end?
            expect(this.processorService.addProcess(testProcess)).toBe(startPro);
        });
    
        // Tests if getScript ... is returning the correct script when given a Process name and type.
        test('TesterProc should return func that adds 1 to dataset', () => {
            expect(this.processorService.getScript(testProcess)).toBe(testStr);
        });
    
        // Tests if doProces... is running on the given data set.
        test('testing do process should return dataset with +1', () => {
            expect(this.processorService.doProcess(testProcess, testData)).toBe(outData);
        });
        };
}
