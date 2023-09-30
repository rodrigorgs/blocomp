import * as Blockly from 'blockly';
import { Order, javascriptGenerator } from 'blockly/javascript';

const moveDirectionBlock: any = {
    "type": "move_direction",
    "message0": "mova para %1",
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
    "message0": "mova %1 passo(s) para frente",
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

export function loadBlocks() {
    Blockly.defineBlocksWithJsonArray([
        moveDirectionBlock,
        moveForwardBlock,
        turnBlock
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

    javascriptGenerator.forBlock['turn'] = function (block: Blockly.Block, generator: any) {
        var dropdown_direction = block.getFieldValue('ORIENTATION');
        let angle = dropdown_direction == 'LEFT' ? -90 : 90;
        var code = `await window.stageManager.turn(${angle});\n`;
        return code;
    };
}
