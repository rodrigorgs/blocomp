
import * as Blockly from 'blockly';
import * as ptBR from 'blockly/msg/pt-br';
//@ts-ignore
import {ContinuousToolbox, ContinuousFlyout, ContinuousMetrics} from '@blockly/continuous-toolbox';
import { loadIlpBlocks } from './toolkits/structured/blocks';
import * as CleaningBlocks from './toolkits/cleaning/blocks';
import { getToolboxJSON } from './toolbox';
import { Editor, RunMode } from './editor/editor';
import { EZSubmissionSession } from './auth/session';
import { EZSubmissionClient, createSingleAnswer } from './ezsubmission/client';
import Swal from 'sweetalert2';
import { CleaningCanvas } from './toolkits/cleaning/runtime';
import * as React from "react";
import { createRoot } from "react-dom/client";
import SigninComponent from './auth/signin_component';
import { ChatManager, MessageType } from './toolkits/chat/runtime';
import axios from 'axios';
import RunBarComponent from './editor/run_bar';

//////////

export function configureWorkspace() {
    // translation
    Blockly.setLocale(ptBR);
    Blockly.Msg["TEXT_PRINT_TITLE"] = "diga %1";
    
    ///////
    
    // load blocks
    loadIlpBlocks();
    CleaningBlocks.loadBlocks();
    

    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    var workspace = Blockly.inject('blocklyDiv', {
        toolbox: getToolboxJSON(window.workspaceConfig?.toolbox?.blocks),
        trashcan: true,
        renderer: 'zelos',
        plugins: {
            'toolbox': ContinuousToolbox,
            'flyoutsVerticalToolbox': ContinuousFlyout,
            'metricsManager': ContinuousMetrics,
        },  
    });
    
    var onresize = function(e:any) {
        var element: any = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace);
    
        console.log('resize');
    };
    window.addEventListener('resize', onresize, false);
    onresize(null);
    
    
    
    const editor = new Editor(workspace, window.workspaceConfig.problem);
    
    workspace.addChangeListener(() => {
        editor.saveWorkspaceToLocalStorage();
    });
    window.addEventListener('load', () => {
        editor.loadWorkspaceFromLocalStorage();
    });
    document.getElementById('btnCarregar')!.addEventListener("click", () => {
        editor.loadWorkspaceFromLocalStorage();
    });
    document.getElementById("btnLimpar")!.addEventListener("click", () => {
        editor.clearWorkspace();
    });
    document.getElementById("btnTestar")!.addEventListener("click", () => {
        editor.runTests();
    });
    
    if (window.workspaceConfig?.stage?.type == 'cleaning') {
        window.stageManager = new CleaningCanvas(document.getElementById("stage"), window.workspaceConfig.stage.data.map);
    }
    window.chatManager = new ChatManager(document.getElementById("chat-messages"));
    
    /////////////////////////////////////
    
    let ez = new EZSubmissionClient('http://localhost:5001/')
    let session = new EZSubmissionSession(ez);
    
    
    const root = createRoot(document.getElementById("signinDiv"));
    root.render(React.createElement(SigninComponent, {client: ez, session}));
    
    const rootRunbar = createRoot(document.getElementById("runbar"));
    rootRunbar.render(React.createElement(RunBarComponent, {editor}));

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
}

export function run() {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonFile = urlParams.get('p');
    if (jsonFile) {
        const path = `problems/${jsonFile}.json`;
        axios.get(path)
            .then(function (response) {
                // if response is a string
                if (typeof response.data == 'string') {
                    throw new Error(`${path} is not a valid JSON file`);
                }
                window.workspaceConfig = response.data;
                window.workspaceConfig.problem.id = jsonFile;
                configureWorkspace();
            });
    }
}

run();