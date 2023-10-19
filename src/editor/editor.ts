import { Problem, TestCase } from "../problem";
import { javascriptGenerator } from 'blockly/javascript';
import * as Blockly from 'blockly';
import { runTests } from "../runner";
import '../window';
import { Toast } from "../alerts/toast";
import { pythonGenerator } from "blockly/python";
import { MessageType } from "../toolkits/chat/runtime";

export enum RunMode {
    SLOW = "SLOW",
    FAST = "FAST",
    STEP = "STEP",
}

export enum ProgramState {
    RESET = "RESET",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
}

export enum RunState {
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
}

enum EditorAction {
    RUN = "RUN",
    DEBUG = "DEBUG",
    STOP = "STOP",
    STEP = "STEP",
    TEST = "TEST",

    SUBMIT = "SUBMIT",
    SAVE = "SAVE",
    LOAD = "LOAD",
    RESET = "RESET",
}

interface EditorState {
    lastAction: EditorAction | null;
    code: string;
    testCases: Array<TestCase>;
    speed: number;
}

export class Editor {
    _stepTimeout: any = null;
    _stepDuration: number = 200;
    private _programState = ProgramState.RESET;
    private _runMode = RunMode.SLOW;
    private _runState = RunState.PAUSED;
    private changeListeners: Array<() => void> = [];
    
    constructor(private workspace: Blockly.WorkspaceSvg, private problem: Problem) {
        this.loadWorkspaceFromLocalStorage();
        const numBlocks = this.workspace.getAllBlocks(false).length;
        if (numBlocks == 0) {
            this.loadInitialWorkspaceIfExists();
        }
    }
    
    addChangeListener(listener: () => void) {
        this.changeListeners.push(listener);
    }
    removeChangeListener(listener: () => void) {
        this.changeListeners = this.changeListeners.filter(x => x != listener);
    }
    onChange() {
        // console.log('onchange', this._runMode, this._runState, this._programState);
        for (const listener of this.changeListeners) {
            listener();
        }
    }

    get runMode() { return this._runMode; }
    get runState() { return this._runState; }
    get programState() { return this._programState; }

    private set runMode(value: RunMode) {
        if (value != this._runMode) {
            this._runMode = value;
            this.onChange();
        }
    }
    private set runState(value: RunState) {
        if (value != this._runState) {
            this._runState = value;
            this.onChange();
        }
    }
    private set programState(value: ProgramState) {
        if (value != this._programState) {
            this._programState = value;
            this.onChange();
        }
    }

    getCode(debugging = false) {
        const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;
        javascriptGenerator.STATEMENT_PREFIX = debugging ? 'await highlightBlock(%1);\n' : '';
        
        try {
            return javascriptGenerator.workspaceToCode(this.workspace);
        } finally {
            javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
        }
    }

    getPythonCode() {
        pythonGenerator.PREFIX = '';
        const code = pythonGenerator.workspaceToCode(this.workspace);
        return code;
    }

    runTests() {
        throw new Error('Method not implemented.');
        // const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;
        // javascriptGenerator.STATEMENT_PREFIX = '';
        
        // try {
        //     const code = javascriptGenerator.workspaceToCode(this.workspace);
        //     const testCases = this.problem.testCases;
            
        //     const report = runTests(code, testCases);
            
        //     if (report.passed) {
        //         alert('Parabéns! Você passou em todos os testes!');
        //     } else {
        //         let reportText = '';
        //         for (const testCaseResult of report.testCaseResults) {
        //             if (!testCaseResult.passed) {
        //                 reportText += `Entrada: ${testCaseResult.input}\n`;
        //                 reportText += `Saída esperada: ${testCaseResult.expectedOutput?.trim()}\n`;
        //                 reportText += `Saída obtida: ${testCaseResult.actualOutput?.trim()}\n`;
        //                 reportText += '\n';
        //             }
        //         }
        //         alert(`Você falhou em ${report.totalTestsRun - report.totalTestsPassed} testes:\n\n${reportText}`);
        //     }
        // } finally {
        //     javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
        // }
    }
    
    async runWorkspace(_runMode: RunMode) {
        if (this.programState == ProgramState.FINISHED) {
            this.reset();
        }
        if (this.programState == ProgramState.STARTED) {
            throw new Error('Program is already running');
        }

        this.programState = ProgramState.STARTED;
        this.runMode = _runMode;
        this.runState = RunState.PAUSED;

        const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;
        
        try {
            javascriptGenerator.STATEMENT_PREFIX = 'await this.highlightBlock(%1);\n';
            javascriptGenerator.STATEMENT_SUFFIX = 'await this.onFinishStep(%1);\n';
            javascriptGenerator.addReservedWords('highlightBlock');
            var code = javascriptGenerator.workspaceToCode(this.workspace);
            code = `
            (async () => {
                ${code}
                this.workspace.highlightBlock('');
            })();
            `;
            console.log(code);
            await eval(code);
            this.onFinishedProgram();
        } catch (e) {
            console.log('error', e);
        } finally {
            javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
        }
    }
    
    reset() {
        this.programState = ProgramState.RESET;
        this.runState = RunState.PAUSED;
        this.runMode = RunMode.FAST;

        window.chatManager?.clear()
        window.chatManager?.addMessage(this.problem.description, MessageType.STATUS);
        window.stageManager?.clear();

        clearTimeout(this._stepTimeout);
        window.dispatchEvent(new CustomEvent('signalNextStep', {detail: {abort: true}}));
        
        this.highlightBlock('');
    }
    
    clearWorkspace() {
        this.workspace.clear();
        localStorage.removeItem(`workspace-${this.problem.id}`);
        this.loadInitialWorkspaceIfExists();
    }
        
    saveWorkspaceToLocalStorage() {
        const json: any = this.getWorkspaceJSON();
        const objModel = JSON.parse(json);
        if (objModel && objModel['blocks']) {
            localStorage.setItem(`workspace-${this.problem.id}`, this.getWorkspaceJSON());
        }
    }
    
    getWorkspaceJSON() {
        var workspaceModel = Blockly.serialization.workspaces.save(this.workspace);
        workspaceModel['code'] = {
            'javascript': this.getCode()
        };
        return JSON.stringify(workspaceModel);
    }
    
    loadWorkspaceFromLocalStorage() {
        console.log('loading workspace');
        const json = localStorage.getItem(`workspace-${this.problem.id}`) || "{}";
        this.loadWorkspaceFromJSON(json);
    }

    loadWorkspaceFromJSON(json: string) {
        Blockly.serialization.workspaces.load(JSON.parse(json), this.workspace);
    }

    loadInitialWorkspaceIfExists() {
        if (this.problem.initialWorkspace) {
            this.loadWorkspaceFromJSON(JSON.stringify(this.problem.initialWorkspace));
        }
    }
    
    async highlightBlock(id: any) {
        if (id !== '') {
            this.runState = RunState.RUNNING;
        }
        this.workspace.highlightBlock(id);
    }

    async onFinishStep(id: any) {
        console.log('onFinishStep');
        
        if (this.runMode == RunMode.STEP) {
            this.runState = RunState.PAUSED;
            await new Promise<void>((resolve, reject) => {
                function handleSignal(event: CustomEvent) {
                    window.removeEventListener('signalNextStep', handleSignal);
                    if (event.detail.abort) {
                        reject();
                    } else {
                        resolve();
                    }
                }
                window.addEventListener('signalNextStep', handleSignal);
            });
        } else if (this.runMode == RunMode.SLOW) {
            await new Promise(resolve => this._stepTimeout = setTimeout(resolve, this._stepDuration)).catch((x) => {console.log('timeout cancelled', x)});
        }
    }

    async onFinishedProgram() {
        console.log('onFinishedProgram');
        this.programState = ProgramState.FINISHED;
        this.runState = RunState.PAUSED;

        const outcome = window.stageManager?.outcome();
        if (outcome) {
            Toast.fire({
                icon: outcome.successful ? 'success' : 'error',
                title: outcome.message
            });
        }
    }

    runNextStep(abort = false) {
        if (this.programState != ProgramState.STARTED) {
            this.runWorkspace(RunMode.STEP);
        }
        window.dispatchEvent(new CustomEvent('signalNextStep', {detail: {abort}}));
    }
}
