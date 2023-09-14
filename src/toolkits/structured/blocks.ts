import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

const inputBlock: any = {
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
    
    javascriptGenerator.forBlock['input'] = function(block: Blockly.Block, generator: any) {
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
