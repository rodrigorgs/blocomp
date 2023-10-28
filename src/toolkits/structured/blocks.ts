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

const inputQuestionBlock: any = {
  "type": "input_question",
  "message0": "pergunte %1 e guarde a resposta como %2 %3 na variável %4",
  "args0": [
    {
      "type": "input_value",
      "name": "QUESTION",
      "check": "String"
    },
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
        ],
        [
          "palavra",
          "WORD"
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
}

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

const formatBlock: any = {
  "type": "format",
  "message0": "formate %1 com %2 casa(s) decimal(is)",
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


const truncateBlock: any = {
  "type": "truncate",
  "message0": "trunca %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NUMBER",
      "check": "Number"
    }
  ],
  "output": null,
  "colour": 230,
  "tooltip": "Calcula a parte inteira de um número",
  "helpUrl": ""
}

export function loadIlpBlocks() {
    Blockly.defineBlocksWithJsonArray([
        inputBlock,
        inputQuestionBlock,
        commentBlock,
        repeatNBlock,
        formatBlock,
        roundBlock,
        truncateBlock,
    ]);
    
    javascriptGenerator.forBlock['input'] = function(block: Blockly.Block, generator: any) {
        var variable_var = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
        const msg = `Digite um ${block.getField('TYPE').getText()} para guardar como ${variable_var}`;
        const msgJSON = JSON.stringify(msg);
        let code = `window.chatManager.addMessage(${msgJSON}, 'request');\n`;
        if (block.getFieldValue('TYPE') === 'NUMBER') {
            code += `${variable_var} = Number(prompt("${msg}", ""));\n`;
        } else {
            code += `${variable_var} = prompt("${msg}", "");\n`;
        }
        code += `window.chatManager.addMessage(${variable_var}, 'sent');\n`;
        return code;
    };

    javascriptGenerator.forBlock['input_question'] = function(block: Blockly.Block, generator: any) {
      var variable_var = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
      var question = generator.valueToCode(block, 'QUESTION', Order.ATOMIC);
      let msg = `"Digite um ${block.getField('TYPE').getText()} para guardar como ${variable_var}"`;
      if (question && question != "''" && question != '""') {
        msg = question;
      }
      
      let code = `window.chatManager.addMessage(${msg}, 'request');\n`;
      if (block.getFieldValue('TYPE') === 'NUMBER') {
          code += `${variable_var} = Number(prompt(${msg}, ""));\n`;
      } else if (block.getFieldValue('TYPE') === 'WORD') {
          code += `${variable_var} = prompt(${msg}, "").split(/ +/)[0];\n`;
      } else {
          code += `${variable_var} = prompt(${msg}, "");\n`;
      }
      code += `window.chatManager.addMessage(${variable_var}, 'sent');\n`;

      code += `this.log('<b>${variable_var}</b>:', ${variable_var});\n`

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

  javascriptGenerator.forBlock['format'] = function (block: Blockly.Block, generator: any) {
    const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
    const precision = block.getFieldValue('PRECISION');
    
    const code = `(${numericExpression}).toFixed(${precision})`
    // const code = 'Math.round((' + numericExpression + ') * Math.pow(10, ' + precision + ')) / Math.pow(10, ' + precision + ')';

    return [code, Order.FUNCTION_CALL];
  };


  javascriptGenerator.forBlock['truncate'] = function (block: Blockly.Block, generator: any) {
    const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
    
    const code = 'Math.trunc(' + numericExpression + ')';

    return [code, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['variables_set'] = function (block: Blockly.Block, generator: any) {
    const varName = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
    return `${varName} = ${value};\nthis.log('<b>${varName}</b>:', ${varName});\n`;
  }

  javascriptGenerator.forBlock['math_change'] = function (block: Blockly.Block, generator: any) {
    const varName = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
    const value = generator.valueToCode(block, 'DELTA', Order.ATOMIC);
    return `${varName} += ${value};\nthis.log('<b>${varName}</b>:', ${varName});\n`;
  }
}
