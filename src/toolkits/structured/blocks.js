// 
import Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import { Order } from 'blockly/javascript';

const inputBlock = {
    "type": "input",
    "message0": "Pede um %1 %2 e guarda como %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "TYPE",
        "options": [
          [
            "número",
            "NUMBER"
          ],
          [
            "texto",
            "TEXT"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "x"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
};


export function loadIlpBlocks() {
    Blockly.defineBlocksWithJsonArray([
        inputBlock,
    ]);
    
    javascriptGenerator.forBlock['input'] = function(block, generator) {
        var variable_var = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
        const msg = `Digite um ${block.getFieldValue('TYPE')} para guardar como ${variable_var}`;

        let code;
        if (block.getFieldValue('TYPE') === 'NUMBER') {
            code = `${variable_var} = Number(prompt("${msg}", ""));\n`;
        } else {
            code = `${variable_var} = prompt("${msg}", "");\n`;
        }
        return code;
    };
}

// export const ilpBlocks = [{
//     "type": "esperar",
//     "message0": "espera",
//     "previousStatement": null,
//     "nextStatement": null,
//     "colour": 230,
//     "tooltip": "esperar",
//     "helpUrl": "esperar"
// }];

// export function loadIlpBlocks() {
//     Blockly.defineBlocksWithJsonArray(ilpBlocks);
      
//     pythonGenerator.forBlock['esperar'] = function (block, generator) {
//         return 'time.sleep(1)\n';
//     };

//     javascriptGenerator.forBlock['esperar'] = function (block, generator) {
//         return 'await new Promise(resolve => setTimeout(resolve, 1000));';
//     }
//     javascriptGenerator.forBlock['text_print'] = function (block, generator) {
//         const msg = generator.valueToCode(block, 'TEXT',
//             Order.NONE) || "''";
//         return 'console.log(' + msg + ');\n';
//     }
//     // add highlight aspect
//     const _oldEsperar = javascriptGenerator.forBlock['esperar']
//     javascriptGenerator.forBlock['esperar'] = function (block, generator) {
//         return _oldEsperar(block, generator) + 'highlightBlock("' + block.id + '");\n';
//     }
// }