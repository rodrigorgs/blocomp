import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

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

export function loadBlocks() {
    Blockly.defineBlocksWithJsonArray([
        moveDirectionBlock,
    ]);
    
    javascriptGenerator.forBlock['move_direction'] = function(block: Blockly.Block, generator: any) {
        var dropdown_direction = block.getFieldValue('DIRECTION');
        // TODO: Assemble javascript into code variable.
        var code = `await window.stageManager.moveDirection("${dropdown_direction}");\n`;
        return code;
    };
}
