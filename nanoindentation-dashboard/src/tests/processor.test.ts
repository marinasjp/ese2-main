import { EProcType } from 'src/app/models/process.model';
import { ProcessorService } from '../app/services/processor.service';

describe('testing Processor', () => {
    const testProc = new ProcessorService(testClient);
    
    test('testing start function', () => {
        expect(testProc.start()).toBe(startProcEg);
    });

    test('shpould return 1', () => {
        expect(testProc.newProcessfunction("Test",EProcType.TEST,testFilterStr)).toBe(startPro);
    });

    test('TesterProc should return func that adds 1 to dataset', () => {
        expect(testProc.getScript("Test", EProcType.TEST)).toBe(testFilterStr);
    });

    test('testing do process should return dataset with +1', () => {
        expect(testProc.doProcess("Test",  EProcType.TEST, testData)).toBe(editedData);
    });
});