import Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { javascriptGenerator } from 'blockly/javascript';
import { Order } from 'blockly/javascript';


export const ilpBlocks = [{
    "type": "esperar",
    "message0": "espera",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "esperar",
    "helpUrl": "esperar"
}];

export function loadIlpBlocks() {
    Blockly.defineBlocksWithJsonArray(ilpBlocks);
      
    pythonGenerator.forBlock['esperar'] = function (block, generator) {
        return 'time.sleep(1)\n';
    };

    javascriptGenerator.forBlock['esperar'] = function (block, generator) {
        return 'await new Promise(resolve => setTimeout(resolve, 1000));';
    }
    javascriptGenerator.forBlock['text_print'] = function (block, generator) {
        const msg = generator.valueToCode(block, 'TEXT',
            Order.NONE) || "''";
        return 'console.log(' + msg + ');\n';
    }
    // add highlight aspect
    const _oldEsperar = javascriptGenerator.forBlock['esperar']
    javascriptGenerator.forBlock['esperar'] = function (block, generator) {
        return _oldEsperar(block, generator) + 'highlightBlock("' + block.id + '");\n';
    }
}