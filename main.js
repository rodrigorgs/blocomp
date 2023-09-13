const Blockly = require('blockly');
const ptBR = require('blockly/msg/pt-br');
const { pythonGenerator } = require('blockly/python');
const { pyodideReadyPromise } = require('./runpython.js');
const { toolbox } = require('./toolbox.js');

Blockly.setLocale(ptBR);

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
    pyodide.runPython(code);
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