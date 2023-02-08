const Processor = {
    processes: {"Filter":[],"CPoint":[],"EModels":[],"FModels":[]}, //Registered process names dict
    processChain: [], //Processes being applied
    dataSet: {}, //Original datasets dict
    currData: {}, //Current dataset dict

    FindProcess: function(procName,procPath){ //Uses the given process name and processes path to give the script
        //smth smth find the process script
        //smth smth return script
    },

    DoProcess: function(procScript,dataSet){ //Takes a script and uses pyodide to run it on the dataSet
        let out = []
        languagePluginLoader.then(function () {
            console.log(pyodide.runPython(`
                import sys
                sys.version
            `));

            console.log(pyodide.runPython(procScript));
            let calculate = pyodide.globals.get('calculate');
            out = calculate(dataSet);
            calculate.destroy();
        });
        return out;
    },

    NewProcess: function(procName, procType, procScript){
        this.processes[procType].push({procName: procScript}) //Adds Script to recognised scripts
        return
    }
}
