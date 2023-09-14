"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
var blockly_1 = __importDefault(require("blockly"));
//@ts-ignore
var ptBR = __importStar(require("blockly/msg/pt-br"));
//@ts-ignore
var javascript_1 = require("blockly/javascript");
//@ts-ignore
var continuous_toolbox_1 = require("@blockly/continuous-toolbox");
//@ts-ignore
// import { pyodideReadyPromise } from './runpython.js';
//@ts-ignore
var blocks_js_1 = require("./toolkits/structured/blocks.js");
//@ts-ignore
var toolbox_js_1 = require("./toolbox.js");
blockly_1.default.setLocale(ptBR);
(0, blocks_js_1.loadIlpBlocks)();
var workspace = blockly_1.default.inject('blocklyDiv', {
    toolbox: toolbox_js_1.toolbox,
    trashcan: true,
    plugins: {
        'toolbox': continuous_toolbox_1.ContinuousToolbox,
        'flyoutsVerticalToolbox': continuous_toolbox_1.ContinuousFlyout,
        'metricsManager': continuous_toolbox_1.ContinuousMetrics,
    },
});
workspace.addChangeListener(saveWorkspaceToLocalStorage);
window.addEventListener('load', loadWorkspaceFromLocalStorage);
(_a = document.getElementById('btnCarregar')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", loadWorkspaceFromLocalStorage);
(_b = document.getElementById("btnRodar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", runWorkspace);
(_c = document.getElementById("btnLimpar")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
    workspace.clear();
    localStorage.removeItem("workspace");
});
(_d = document.getElementById("btnTestar")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
    javascript_1.javascriptGenerator.STATEMENT_PREFIX = '';
    var code = javascript_1.javascriptGenerator.workspaceToCode(workspace);
    var testCases = window.problem.testCases;
    var report = '';
    var failedTests = 0;
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var testCase = testCases_1[_i];
        var inputText = testCase.input;
        var expectedOutput = testCase.output;
        var outputText = runTests(code, inputText);
        console.log('inputText = ', inputText);
        console.log('outputText = ', outputText);
        console.log('expectedOutput = ', expectedOutput);
        if ((outputText === null || outputText === void 0 ? void 0 : outputText.trim()) !== (expectedOutput === null || expectedOutput === void 0 ? void 0 : expectedOutput.trim())) {
            failedTests++;
            report += "Entrada: ".concat(inputText, "\n");
            report += "Sa\u00EDda esperada: ".concat(expectedOutput, "\n");
            report += "Sa\u00EDda obtida: ".concat(outputText, "\n");
            report += '\n';
        }
    }
    if (failedTests > 0) {
        report = "Falhou em ".concat(failedTests, " testes:\n\n") + report;
    }
    else {
        report = 'Passou em todos os testes!';
    }
    alert(report);
});
/////////////////////////////////////
function highlightBlock(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('will highlight', id);
                    workspace.highlightBlock(id);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runTests(code, inputText) {
    var oldAlert = window.alert;
    var oldPrompt = window.prompt;
    try {
        var output_1 = '';
        window.alert = function (msg) {
            output_1 += msg + '\n';
        };
        var input_1 = inputText.split('\n');
        var inputIndex_1 = 0;
        window.prompt = function (msg) {
            return input_1[inputIndex_1++];
        };
        try {
            eval(code);
        }
        catch (e) {
            oldAlert(e);
        }
        return output_1;
    }
    finally {
        window.alert = oldAlert;
        window.prompt = oldPrompt;
    }
}
function runWorkspace() {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            javascript_1.javascriptGenerator.STATEMENT_PREFIX = 'await highlightBlock(%1);\n';
            javascript_1.javascriptGenerator.addReservedWords('highlightBlock');
            code = javascript_1.javascriptGenerator.workspaceToCode(workspace);
            code = "async function main() { ".concat(code, "; highlightBlock('') }\nmain();");
            console.log(code);
            eval(code);
            return [2 /*return*/];
        });
    });
}
// async function runInPyodide(code) {
//     const pyodide = await pyodideReadyPromise;
//     pyodide.runPython(`import time\n${code}`);
// }
function saveWorkspaceToLocalStorage(event) {
    var workspaceModel = blockly_1.default.serialization.workspaces.save(workspace);
    workspaceModel['code'] = {
        'javascript': javascript_1.javascriptGenerator.workspaceToCode(workspace)
    };
    localStorage.setItem("workspace", JSON.stringify(workspaceModel));
}
function loadWorkspaceFromLocalStorage() {
    var json = localStorage.getItem("workspace") || "{}";
    blockly_1.default.serialization.workspaces.load(JSON.parse(json), workspace);
}
