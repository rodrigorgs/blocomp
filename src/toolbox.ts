const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    { "kind": "category", "flyoutOpen": true, "name": "Movimento", "colour": 30, "contents": [
      { "kind": "block", "type": "move_direction" },
      { "kind": "block", "type": "move_forward_one" },
      { "kind": "block", "type": "move_forward", "inputs": { "STEPS": { "block": { "type": "math_number", "fields": { "NUM": 1 } } } } },
      { "kind": "block", "type": "turn" },
      { "kind": "block", "type": "turn", "fields": { "ORIENTATION": "RIGHT" } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Comunicação", "colour": 165, "contents": [
      { "kind": "block", "type": "text_print", "inputs": { "TEXT": { "block": { "type": "text", "fields": { "TEXT": "Olá" } } } } },
      { "kind": "block", "type": "input_question", "inputs": { "QUESTION": { "block": { "type": "text", "fields": { "TEXT": "Qual sua idade?" } } } } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Texto", "colour": 165, "contents": [
      { "kind": "block", "type": "text", "fields": { "TEXT": "Olá" } },
      { "kind": "block", "type": "text_join" },
    ]},    
    { "kind": "category", "flyoutOpen": true, "name": "Números", "colour": 230, "contents": [
      { "kind": "block", "type": "math_number", "fields": { "NUM": 1 } },
      { "kind": "block", "type": "math_arithmetic" },
      { "kind": "block", "type": "truncate" },
      { "kind": "block", "type": "round" },
      { "kind": "block", "type": "format" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Variáveis", "custom": "VARIABLE", "colour": 330, "contents": [
      { "kind": "block", "type": "variables_get", "fields": { "VAR": { "name": "x" } } },
      { "kind": "block", "type": "variables_set", "fields": { "VAR": { "name": "x" } } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Condição", "colour": 210, "contents": [
      { "kind": "block", "type": "controls_if" },
      { "kind": "block", "type": "logic_compare" },
      { "kind": "block", "type": "logic_negate" },
      { "kind": "block", "type": "logic_operation" },
      { "kind": "block", "type": "if_no_obstacle" },
      { "kind": "block", "type": "condition_presence" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Repetição", "colour": 120, "contents": [
      { "kind": "block", "type": "controls_repeat_ext", "inputs": { "TIMES": { "block": { "type": "math_number", "fields": { "NUM": 2 } } } } },
      { "kind": "block", "type": "repeat_n" },
      { "kind": "block", "type": "repeat_until_goal" },
      { "kind": "block", "type": "controls_whileUntil" },
      { "kind": "block", "type": "controls_for" },
      { "kind": "block", "type": "controls_flow_statements" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Organização", "colour": 45, "contents": [
      { "kind": "block", "type": "comment" },
    ]},
  ]
};

export function getToolboxJSON(blocks?: Array<string>) {
  let filteredToolbox = JSON.parse(JSON.stringify(toolbox));

  if (blocks?.length > 0) {
    if (window.workspaceConfig.toolbox?.blocks?.length > 0) {
      filteredToolbox.contents = [];
      for (let section of toolbox.contents) {
        let filteredSection = JSON.parse(JSON.stringify(section));
        filteredSection.contents = section.contents.filter((block: any) => {
            return window.workspaceConfig.toolbox.blocks.includes(block.type);
        });
        if (filteredSection.contents.length > 0) {
          filteredToolbox.contents.push(filteredSection);
        }
      }
    }
  }

  return filteredToolbox;
}