import { Problem, TestCase } from "./problem";
import { javascriptGenerator } from 'blockly/javascript';
import * as Blockly from 'blockly';
import { runTests } from "./runner";

declare global {
    interface Window {
        problem: {
            name: string;
            description: string;
            testCases: Array<{
                input: string;
                output: string;
            }>;
        };
    }
}

export enum RunMode {
    FAST = "FAST",
    SLOW = "SLOW",
    STEP = "STEP",
    NOT_RUNNING = "NOT_RUNNING",
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

let globalWorkspace: Blockly.WorkspaceSvg = null;

export class Editor {
    _runMode: RunMode = RunMode.NOT_RUNNING;
    _stepTimeout: any = null;
    
    constructor(private workspace: Blockly.WorkspaceSvg, private problem: Problem) {
        globalWorkspace = this.workspace;
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
    
    runTests() {
        const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;
        javascriptGenerator.STATEMENT_PREFIX = '';
        
        try {
            const code = javascriptGenerator.workspaceToCode(this.workspace);
            const testCases = this.problem.testCases;
            
            const report = runTests(code, testCases);
            
            if (report.passed) {
                alert('Parabéns! Você passou em todos os testes!');
            } else {
                let reportText = '';
                for (const testCaseResult of report.testCaseResults) {
                    if (!testCaseResult.passed) {
                        reportText += `Entrada: ${testCaseResult.input}\n`;
                        reportText += `Saída esperada: ${testCaseResult.expectedOutput?.trim()}\n`;
                        reportText += `Saída obtida: ${testCaseResult.actualOutput?.trim()}\n`;
                        reportText += '\n';
                    }
                }
                alert(`Você falhou em ${report.totalTestsRun - report.totalTestsPassed} testes:\n\n${reportText}`);
            }
        } finally {
            javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
        }
    }
    
    async runWorkspace(runMode: RunMode = RunMode.SLOW) {
        if (this._runMode != RunMode.NOT_RUNNING) {
            console.log('already running');
            return;
        }

        this._runMode = runMode;

        const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;
        
        try {
            javascriptGenerator.STATEMENT_PREFIX = 'await this.highlightBlock(%1);\n';
            javascriptGenerator.STATEMENT_SUFFIX = 'await this.onFinishStep(%1);\n';
            javascriptGenerator.addReservedWords('highlightBlock');
            var code = javascriptGenerator.workspaceToCode(this.workspace);
            code = `
            (async () => {
                this._cancelExecution = false;
                try {
                    ${code}
                } catch (e) {
                    console.log('Execução cancelada');
                } finally {
                    this.workspace.highlightBlock('');
                }
            })();
            `;
            console.log(code);
            await eval(code);
        } finally {
            javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
            runMode = RunMode.NOT_RUNNING;
        }
    }
    
    stopExecution() {
        window.dispatchEvent(new Event('signalNextStep'));
        clearTimeout(this._stepTimeout);
        this.highlightBlock('');
        this._runMode = RunMode.NOT_RUNNING;
    }
    
    clearWorkspace() {
        this.workspace.clear();
        localStorage.removeItem("workspace");
    }
    
    
    saveWorkspaceToLocalStorage() {
        const json: any = this.getWorkspaceJSON();
        const objModel = JSON.parse(json);
        if (objModel && objModel['blocks']) {
            localStorage.setItem("workspace", this.getWorkspaceJSON());
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
        var json = localStorage.getItem("workspace") || "{}";
        Blockly.serialization.workspaces.load(JSON.parse(json), this.workspace);
        console.log('done');
    }
    
    async highlightBlock(id: any) {
        this.workspace.highlightBlock(id);
    }

    async onFinishStep(id: any) {
        console.log('onFinishStep');
        
        if (this._runMode == RunMode.STEP) {
            await new Promise<void>(resolve => {
                function handleSignal() {
                window.removeEventListener('signalNextStep', handleSignal);
                resolve();
                }
                window.addEventListener('signalNextStep', handleSignal);
            });
        } else if (this._runMode == RunMode.SLOW) {
            await new Promise(resolve => this._stepTimeout = setTimeout(resolve, 1000)).catch((x) => {console.log('timeout cancelled', x)});
        }
    }
    
    runNextStep() {
        if (this._runMode == RunMode.NOT_RUNNING) {
            this.runWorkspace(RunMode.STEP);
        }
        window.dispatchEvent(new Event('signalNextStep'));
    }
}
