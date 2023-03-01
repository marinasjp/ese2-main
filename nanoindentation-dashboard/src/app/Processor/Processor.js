const Processor = {
    processes: {"Filter":{},"CPoint":{},"EModels":{},"FModels":{}}, //Registered processes dict
    processChain: [], //Processes being applied
    currData: {}, //Current dataset dict

    Start: function(){
        let procPath = "./Processes"
        
    },
    GetScript: function(procName, procType){//Uses the given process name and processes path to give the script
        //find process in dict of known processes
        let typeProcs = this.processes.get(procType);
        if ( typeProcs == null){
            //ProcType error
        }
        let script = typeProcs[procName];
        if (script == null){
            //script error
        }
        return script;
    },

    DoProcess: function(procName, procType, dataSet=this.currData){ //Takes a script and uses pyodide to run it on the dataSet
        procScript = this.GetScript(procName, procType); //get the process script 
        let out = []
        languagePluginLoader.then(function () { //initialize pyodide
            console.log(pyodide.runPython(`
                import sys
                sys.version
            `));

            console.log(pyodide.runPython(procScript)); //run proc script 
            let calculate = pyodide.globals.get('calculate'); //map calculate method onto js function
            out = calculate(dataSet); 
            calculate.destroy(); //release memory
        });
        this.processChain.push((procType,procName)); //add process to known process chain
        this.currData = out;
        return out;
    },

    NewProcess: function(procName, procType, procScript){
        this.processes[procType][procName] = procScript //Adds Script to recognised scripts
        return
    }
}
