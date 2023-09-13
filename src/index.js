import Blockly from 'blockly';
// const ptBR = require('blockly/msg/pt-br');
import * as ptBR from 'blockly/msg/pt-br';
import { pythonGenerator } from 'blockly/python';
import { pyodideReadyPromise } from './runpython.js';
import { loadIlpBlocks } from './customBlocks.js';
import { toolbox } from './toolbox.js';

Blockly.setLocale(ptBR);

loadIlpBlocks(Blockly, pythonGenerator);

var workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    trashcan: true,
    collapse: false
});

workspace.addChangeListener(saveWorkspaceToLocalStorage);

/////////////////////////////////////

document.getElementById("btnRodar").addEventListener("click", async function() {
    var code = pythonGenerator.workspaceToCode(workspace);
    console.log(code);
    await runInPyodide(code);
});

async function runInPyodide(code) {
    const pyodide = await pyodideReadyPromise;
    pyodide.runPython(`import time\n${code}`);
}

function saveWorkspaceToLocalStorage(event) {
    var workspaceModel = Blockly.serialization.workspaces.save(workspace);
    // console.log('json = ', json)
    localStorage.setItem("workspace", JSON.stringify(workspaceModel));
}

function loadWorkspaceFromLocalStorage() {
    var json = localStorage.getItem("workspace") || "{}";
    console.log('json=', json)
    Blockly.serialization.workspaces.load(JSON.parse(json));
}

document.getElementById('btnCarregar').addEventListener("click", loadWorkspaceFromLocalStorage);