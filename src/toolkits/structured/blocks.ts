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

var repeatNBlock: any = {
  "type": "repeat_n",
  "message0": "repita %1 vezes %2 %3",
  "args0": [
    {
      "type": "field_number",
      "name": "COUNT",
      "value": 2,
      "min": 2
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
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}

const roundBlock: any = {
  "type": "round",
  "message0": "arredonda %1 para %2 casa(s) decimal(is)",
  "args0": [
    {
      "type": "input_value",
      "name": "NUMBER",
      "check": "Number"
    },
    {
      "type": "field_number",
      "name": "PRECISION",
      "value": 0,
      "min": 0
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function loadIlpBlocks() {
    Blockly.defineBlocksWithJsonArray([
        inputBlock,
        commentBlock,
        repeatNBlock,
        roundBlock
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

  javascriptGenerator.forBlock['repeat_n'] = function (block: Blockly.Block, generator: any) {
    const repeats = block.getFieldValue('COUNT');
    let branch = generator.statementToCode(block, 'STATEMENTS');
    branch = generator.addLoopTrap(branch, block);
    let code = '';
    const loopVar =
        generator.nameDB_.getDistinctName('count', 'VARIABLE');
    let endVar = repeats;
    code += 'for (var ' + loopVar + ' = 0; ' + loopVar + ' < ' + endVar + '; ' +
        loopVar + '++) {\n' + branch + '}\n';
    return code;
  }

  javascriptGenerator.forBlock['round'] = function (block: Blockly.Block, generator: any) {
    const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
    const precision = block.getFieldValue('PRECISION');
    
    const code = 'Math.round((' + numericExpression + ') * Math.pow(10, ' + precision + ')) / Math.pow(10, ' + precision + ')';

    return [code, Order.FUNCTION_CALL];
  };
}
