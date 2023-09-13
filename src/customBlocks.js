export const ilpBlocks = [{
    "type": "esperar",
    "message0": "espera",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "esperar",
    "helpUrl": "esperar"
}];

export function loadIlpBlocks(Blockly, pythonGenerator) {
    Blockly.defineBlocksWithJsonArray(ilpBlocks);
      
      pythonGenerator.forBlock['esperar'] = function (block, generator) {
          return 'time.sleep(1)\n';
      };      
}