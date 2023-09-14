import Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
import { javascriptGenerator } from 'blockly/javascript';
import {ContinuousToolbox, ContinuousFlyout, ContinuousMetrics} from '@blockly/continuous-toolbox';

import { pyodideReadyPromise } from './runpython.js';
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

workspace.addChangeListener(saveWorkspaceToLocalStorage);
window.addEventListener('load', loadWorkspaceFromLocalStorage);

document.getElementById('btnCarregar').addEventListener("click", loadWorkspaceFromLocalStorage);
document.getElementById("btnRodar").addEventListener("click", runWorkspace);
document.getElementById("btnLimpar").addEventListener("click", () => {
    workspace.clear();
    localStorage.removeItem("workspace");
});

document.getElementById("btnTestar").addEventListener("click", () => {
    javascriptGenerator.STATEMENT_PREFIX = '';

    const code = javascriptGenerator.workspaceToCode(workspace);
    
    const testCases = window.problem.testCases;
    let report = '';
    let failedTests = 0;
    for (const testCase of testCases) {
        const inputText = testCase.input;
        const expectedOutput = testCase.output;

        const outputText = runTests(code, inputText);

        console.log('inputText = ', inputText);
        console.log('outputText = ', outputText);
        console.log('expectedOutput = ', expectedOutput);

        if (outputText?.trim() !== expectedOutput?.trim()) {
            failedTests++;
            report += `Entrada: ${inputText}\n`;
            report += `Saída esperada: ${expectedOutput}\n`;
            report += `Saída obtida: ${outputText}\n`;
            report += '\n';
        }
    }
    if (failedTests > 0) {
        report = `Falhou em ${failedTests} testes:\n\n` + report;
    } else {
        report = 'Passou em todos os testes!';
    }
    alert(report);

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
        'javascript': javascriptGenerator.workspaceToCode(workspace)
    };
    localStorage.setItem("workspace", JSON.stringify(workspaceModel));
}

function loadWorkspaceFromLocalStorage() {
    var json = localStorage.getItem("workspace") || "{}";
    Blockly.serialization.workspaces.load(JSON.parse(json), workspace);
}

