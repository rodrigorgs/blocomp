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

    constructor(private workspace: Blockly.WorkspaceSvg, private problem: Problem) {
        globalWorkspace = this.workspace;
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

    async debugWorkspace() {
        const _oldStatementPrefix = javascriptGenerator.STATEMENT_PREFIX;

        try {
            javascriptGenerator.STATEMENT_PREFIX = 'await highlightBlock(%1);\n';
            javascriptGenerator.addReservedWords('highlightBlock');
            var code = javascriptGenerator.workspaceToCode(this.workspace);
            code = `async function main() { ${code}; highlightBlock('') }\nmain();`;
            console.log(code);
            eval(code);
        } finally {
            javascriptGenerator.STATEMENT_PREFIX = _oldStatementPrefix;
        }
    }

    clearWorkspace() {
        this.workspace.clear();
        localStorage.removeItem("workspace");
    }

    saveWorkspaceToLocalStorage() {
        var workspaceModel = Blockly.serialization.workspaces.save(this.workspace);
        workspaceModel['code'] = {
            'javascript': javascriptGenerator.workspaceToCode(this.workspace)
        };
        localStorage.setItem("workspace", JSON.stringify(workspaceModel));
    }
    
    loadWorkspaceFromLocalStorage() {
        var json = localStorage.getItem("workspace") || "{}";
        Blockly.serialization.workspaces.load(JSON.parse(json), this.workspace);
    }
    
    
}
async function highlightBlock(id: any) {
    console.log('will highlight', id);
    globalWorkspace.highlightBlock(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
}
