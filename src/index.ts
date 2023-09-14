
import * as Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
//@ts-ignore
import {ContinuousToolbox, ContinuousFlyout, ContinuousMetrics} from '@blockly/continuous-toolbox';
import { loadIlpBlocks } from './toolkits/structured/blocks';
import { toolbox } from './toolbox';
import { Editor } from './editor';

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
const editor = new Editor(workspace, window.problem);

workspace.addChangeListener(() => {
    editor.saveWorkspaceToLocalStorage();
});
window.addEventListener('load', () => {
    editor.loadWorkspaceFromLocalStorage();
});
document.getElementById('btnCarregar')!.addEventListener("click", () => {
    editor.loadWorkspaceFromLocalStorage();
});
document.getElementById("btnRodar")!.addEventListener("click", () => {
    editor.debugWorkspace();
});
document.getElementById("btnLimpar")!.addEventListener("click", () => {
    editor.clearWorkspace();
});
document.getElementById("btnTestar")!.addEventListener("click", () => {
    editor.runTests();
});
/////////////////////////////////////

