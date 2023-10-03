import * as Blockly from 'blockly';
import { Order, javascriptGenerator } from 'blockly/javascript';

const moveDirectionBlock: any = {
    "type": "move_direction",
    "message0": "ande para %1",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "DIRECTION",
            "options": [
                [
                    "← esquerda",
                    "LEFT"
                ],
                [
                    "→ direita",
                    "RIGHT"
                ],
                [
                    "↑ cima",
                    "UP"
                ],
                [
                    "↓ baixo",
                    "DOWN"
                ]
            ]
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "Move para determinada direção",
    "helpUrl": ""
}

const moveForwardBlock: any = {
    "type": "move_forward",
    "message0": "ande %1 passo(s) para frente",
    "args0": [
        {
            "type": "input_value",
            "name": "STEPS",
            "check": "Number"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "Move para frente",
    "helpUrl": ""
}

const moveForwardOneBlock: any = {
  "type": "move_forward_one",
  "message0": "ande 1 passo para frente",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 165,
  "tooltip": "Move um passo para frente",
  "helpUrl": ""
}

const turnBlock: any = {
    "type": "turn",
    "message0": "gire para a %1",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "ORIENTATION",
            "options": [
                [
                    "↰ esquerda",
                    "LEFT"
                ],
                [
                    "↱ direita",
                    "RIGHT"
                ]
            ]
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "Gira",
    "helpUrl": ""
}

const repeatUntilGoalBlock: any = {
    "type": "repeat_until_goal",
    "message0": "repita até chegar ao %1 %2 %3",
    "args0": [
      {
        "type": "field_image",
        "src": "assets/goal.png",
        "width": 15,
        "height": 15,
        "alt": "destino",
        "flipRtl": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "STATEMENT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
}

const ifNoObstacleBlock: any = {
    "type": "if_no_obstacle",
    "message0": "se não tem obstáculo à %1 %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [
            "frente",
            "AHEAD"
          ],
          [
            "esquerda ↺",
            "LEFT"
          ],
          [
            "direita ↻",
            "RIGHT"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "STATEMENT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "",
    "helpUrl": ""
}

export function loadBlocks() {
    Blockly.defineBlocksWithJsonArray([
        moveDirectionBlock,
        moveForwardOneBlock,
        moveForwardBlock,
        turnBlock,
        repeatUntilGoalBlock,
        ifNoObstacleBlock,
    ]);

    javascriptGenerator.forBlock['move_direction'] = function (block: Blockly.Block, generator: any) {
        var direction = block.getFieldValue('DIRECTION');
        var code = `await window.stageManager.moveDirection("${direction}");\n`;
        return code;
    };
    javascriptGenerator.forBlock['move_forward'] = function (block: Blockly.Block, generator: any) {
        // var steps = block.getFieldValue('STEPS');
        var steps = generator.valueToCode(block, 'STEPS', Order.ATOMIC);
        var code = `await window.stageManager.moveForward(${steps});\n`;
        return code;
    };
    javascriptGenerator.forBlock['move_forward_one'] = function (block: Blockly.Block, generator: any) {
        return `await window.stageManager.moveForward(1);\n`;
    };
    javascriptGenerator.forBlock['repeat_until_goal'] = function (block: Blockly.Block, generator: any) {
        var statements = generator.statementToCode(block, 'STATEMENT');
        var code = `while (!window.stageManager.hasRobotReachedGoalPosition()) {\n${statements}\n}\n`;
        return code;
    };
    javascriptGenerator.forBlock['if_no_obstacle'] = function (block: Blockly.Block, generator: any) {
        var statements = generator.statementToCode(block, 'STATEMENT');
        const direction = block.getFieldValue('DIRECTION');
        var code = `if (!window.stageManager.hasObstacleAtDirection("${direction}")) {\n${statements}\n}\n`;
        return code;
    };

    javascriptGenerator.forBlock['turn'] = function (block: Blockly.Block, generator: any) {
        var dropdown_direction = block.getFieldValue('ORIENTATION');
        let angle = dropdown_direction == 'LEFT' ? -90 : 90;
        var code = `await window.stageManager.turn(${angle});\n`;
        return code;
    };
}
