
import * as Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
//@ts-ignore
import {ContinuousToolbox, ContinuousFlyout, ContinuousMetrics} from '@blockly/continuous-toolbox';
import { loadIlpBlocks } from './toolkits/structured/blocks';
import { toolbox } from './toolbox';
import { Editor } from './editor';
import { EZSubmissionSession } from './auth/session';
import { EZSubmissionClient, createSingleAnswer } from './ezsubmission/client';
import Swal from 'sweetalert2';

//////////

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

let ez = new EZSubmissionClient('http://localhost:5001/')
let session = new EZSubmissionSession(ez);

import * as React from "react";
import { createRoot } from "react-dom/client";
import SigninComponent from './auth/signin_component';
const root = createRoot(document.getElementById("signinDiv"));
root.render(React.createElement(SigninComponent, {client: ez, session}));


async function submitAnswer() {
    try {
        const answer = createSingleAnswer(
            editor.getWorkspaceJSON(),
            window.location.href,    
        )
        const response = await ez.submit(answer);
        console.log(response);
        await Swal.fire({
            text: 'Sua resposta foi enviada com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    } catch (e) {
        console.log(e);
        await Swal.fire({
            text: 'Erro ao enviar resposta',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

document.getElementById("btnEnviar")!.addEventListener("click", async () => {
    if (session.isLoggedIn()) {
        submitAnswer();
    } else {
        await Swal.fire({
            text: 'É preciso entrar com login e senha para enviar a resposta',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
});