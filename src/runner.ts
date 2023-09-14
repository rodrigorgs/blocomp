import { TestCase } from './problem';

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
}

export interface TestSuiteReport {
    passed: boolean;
    totalTestsRun: number;
    totalTestsPassed: number;
    testCaseResults: Array<TestCaseResult>;
}

export function runTests(code: string, testCases: Array<TestCase>): TestSuiteReport {
    let report: TestSuiteReport = {
        passed: false,
        totalTestsRun: 0,
        totalTestsPassed: 0,
        testCaseResults: [],
    };
    
    for (const testCase of testCases) {
        let result: TestCaseResult = {
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: '',
            passed: false,
        };

        const inputText = testCase.input;
        const expectedOutput = testCase.output;

        const outputText = runCodeInTestMode(code, inputText);
        report.totalTestsRun++;
        result.actualOutput = outputText;

        if (outputText?.trim() === expectedOutput?.trim()) {
            report.totalTestsPassed++;
            result.passed = true;
        } else {
            result.passed = false;
        }

        report.testCaseResults.push(result);
    }
    
    report.passed = report.totalTestsPassed === report.totalTestsRun;

    return report;
}

function runCodeInTestMode(code: any, inputText: any) {
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
