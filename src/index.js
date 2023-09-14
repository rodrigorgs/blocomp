import Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import {ContinuousToolbox, ContinuousFlyout, ContinuousMetrics} from '@blockly/continuous-toolbox';

import { pyodideReadyPromise } from './runpython.js';
// import { loadIlpBlocks } from './customBlocks.js';
import { loadIlpBlocks } from './toolkits/structured/blocks.js';
import { toolbox } from './toolbox.js';

Blockly.setLocale(ptBR);

loadIlpBlocks();

var workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    trashcan: true,
    plugins: {
        'toolbox': ContinuousToolbox,
        'flyoutsVerticalToolbox': ContinuousFlyout,
        'metricsManager': ContinuousMetrics,
    },  
});
// workspace.registerToolboxCategoryCallback('VARIABLES', function(workspace) {

// });


workspace.addChangeListener(saveWorkspaceToLocalStorage);
window.addEventListener('load', loadWorkspaceFromLocalStorage);

document.getElementById('btnCarregar').addEventListener("click", loadWorkspaceFromLocalStorage);
document.getElementById("btnRodar").addEventListener("click", runWorkspace);
document.getElementById("btnLimpar").addEventListener("click", () => {
    workspace.clear();
    localStorage.removeItem("workspace");
});
// Example of increment algorithm
document.getElementById("btnTestar").addEventListener("click", () => {
    javascriptGenerator.STATEMENT_PREFIX = '';

    const code = javascriptGenerator.workspaceToCode(workspace);
    const inputText = "5";
    const outputText = runTests(code, inputText);
    const expectedOutput = "6";
    console.log('outputText', outputText);
    alert(outputText?.trim() === expectedOutput?.trim());

});
/////////////////////////////////////

async function highlightBlock(id) {
    console.log('will highlight', id);
    workspace.highlightBlock(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
}

function runTests(code, inputText) {
    const oldAlert = window.alert;
    const oldPrompt = window.prompt;

    try {
        let output = ''
        window.alert = function (msg) {
            output += msg + '\n';
        }
    
        const input = inputText.split('\n');
        let inputIndex = 0;
        window.prompt = function (msg) {
            return input[inputIndex++];
        }
    
        try {
            eval(code);
        } catch (e) {
            oldAlert(e);
        }

        return output;
    } finally {
        window.alert = oldAlert;
        window.prompt = oldPrompt;
    }
}

async function runWorkspace() {
    // var code = pythonGenerator.workspaceToCode(workspace);
    // console.log(code);
    // await runInPyodide(code);

    javascriptGenerator.STATEMENT_PREFIX = 'await highlightBlock(%1);\n';
    javascriptGenerator.addReservedWords('highlightBlock');
    var code = javascriptGenerator.workspaceToCode(workspace);
    code = `async function main() { ${code}; highlightBlock('') }\nmain();`;
    console.log(code);
    eval(code);
}

async function runInPyodide(code) {
    const pyodide = await pyodideReadyPromise;
    pyodide.runPython(`import time\n${code}`);
}

function saveWorkspaceToLocalStorage(event) {
    var workspaceModel = Blockly.serialization.workspaces.save(workspace);
    workspaceModel['code'] = {
        // 'python': pythonGenerator.workspaceToCode(workspace),
        'javascript': javascriptGenerator.workspaceToCode(workspace)
    };
    // console.log('json = ', json)
    localStorage.setItem("workspace", JSON.stringify(workspaceModel));
}

function loadWorkspaceFromLocalStorage() {
    var json = localStorage.getItem("workspace") || "{}";
    Blockly.serialization.workspaces.load(JSON.parse(json), workspace);
}

