import { EProcType } from 'src/app/models/process.model';
import { ProcessorService } from '../app/services/processor.service';

describe('testing Processor', () => {
    const testProc = new ProcessorService(testClient);
    
    // Tests if the start function is ... producing a data structure with all of the python scripts in it.
    test('testing start function', () => {
        expect(testProc.start()).toBe(startProcEg);
    });

    // Tests if the newProcess function is ... a new python script (Process) is added to the data structure.
    test('should return 1', () => { // maybe test if it is at the end?
        expect(testProc.newProcessfunction("Test",EProcType.TEST,testFilterStr)).toBe(startPro);
    });

    // Tests if getScript ... is returning the correct script when given a Process name and type.
    test('TesterProc should return func that adds 1 to dataset', () => {
        expect(testProc.getScript("Test", EProcType.TEST)).toBe(testFilterStr);
    });

    // Tests if doProces... is running on the given data set.
    test('testing do process should return dataset with +1', () => {
        expect(testProc.doProcess("Test",  EProcType.TEST, testData)).toBe(editedData);
    });
});