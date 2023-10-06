import * as Blockly from 'blockly';
import { Order, javascriptGenerator } from 'blockly/javascript';

const inputBlock: any = {
    "type": "input",
    "message0": "peça um %1 %2 e guarde como %3",
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
    "colour": 165,
    "tooltip": "",
    "helpUrl": ""
};

const commentBlock: any = {
  "type": "comment",
  "message0": "%1 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "CONTENT",
      "text": "Anotação pessoal..."
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "STATEMENTS"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 45,
  "tooltip": "",
  "helpUrl": ""
}

export function loadIlpBlocks() {
    Blockly.defineBlocksWithJsonArray([
        inputBlock,
        commentBlock,
    ]);
    
    javascriptGenerator.forBlock['input'] = function(block: Blockly.Block, generator: any) {
        var variable_var = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
        const msg = `Digite um ${block.getFieldValue('TYPE')} para guardar como ${variable_var}`;
        const msgJSON = JSON.stringify(msg);
        let code = `window.chatManager.addMessage(${msgJSON}, 'received');\n`;
        if (block.getFieldValue('TYPE') === 'NUMBER') {
            code += `${variable_var} = Number(prompt("${msg}", ""));\n`;
        } else {
            code += `${variable_var} = prompt("${msg}", "");\n`;
        }
        code += `window.chatManager.addMessage(${variable_var}, 'sent');\n`;
        return code;
    };

    javascriptGenerator.forBlock['text_print'] = function (block: Blockly.Block, generator: any) {
      const msg = generator.valueToCode(block, 'TEXT',
          Order.NONE) || "''";
      
      return `window.chatManager.addMessage(${msg}, 'received');\n`;
  }

  javascriptGenerator.forBlock['comment'] = function (block: Blockly.Block, generator: any) {
    var comment = block.getFieldValue('CONTENT');
    var statements = generator.statementToCode(block, 'STATEMENTS');
    
    var code = `// ${comment}\n${statements}`;
    return code;
  };
}
