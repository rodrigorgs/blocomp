import Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import { pyodideReadyPromise } from './runpython.js';
import { loadIlpBlocks } from './customBlocks.js';
import { toolbox } from './toolbox.js';

Blockly.setLocale(ptBR);

loadIlpBlocks();

var workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    trashcan: true,
    collapse: false
});

workspace.addChangeListener(saveWorkspaceToLocalStorage);
window.addEventListener('load', loadWorkspaceFromLocalStorage);

/////////////////////////////////////

function highlightBlock(id) {
    console.log('will highlight', id);
    workspace.highlightBlock(id);
}

document.getElementById("btnRodar").addEventListener("click", async function() {
    // var code = pythonGenerator.workspaceToCode(workspace);
    // console.log(code);
    // await runInPyodide(code);

    var code = javascriptGenerator.workspaceToCode(workspace);
    code = `async function main() { ${code} }\nmain();`;
    console.log(code);
    eval(code);
});

async function runInPyodide(code) {
    const pyodide = await pyodideReadyPromise;
    pyodide.runPython(`import time\n${code}`);
}

function saveWorkspaceToLocalStorage(event) {
    var workspaceModel = Blockly.serialization.workspaces.save(workspace);
    workspaceModel['code'] = {
        'python': pythonGenerator.workspaceToCode(workspace),
        'javascript': javascriptGenerator.workspaceToCode(workspace)
    };
    // console.log('json = ', json)
    localStorage.setItem("workspace", JSON.stringify(workspaceModel));
}

function loadWorkspaceFromLocalStorage() {
    var json = localStorage.getItem("workspace") || "{}";
    Blockly.serialization.workspaces.load(JSON.parse(json), workspace);
}

document.getElementById('btnCarregar').addEventListener("click", loadWorkspaceFromLocalStorage);