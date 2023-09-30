export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    { "kind": "category", "flyoutOpen": true, "name": "Movimento", "colour": 165, "contents": [
      { "kind": "block", "type": "move_direction" },
      { "kind": "block", "type": "move_forward", "inputs": { "STEPS": { "block": { "type": "math_number", "fields": { "NUM": 1 } } } } },
      { "kind": "block", "type": "turn" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "E/S", "colour": 165, "contents": [
      { "kind": "block", "type": "text_print", "inputs": { "TEXT": { "block": { "type": "text", "fields": { "TEXT": "Olá" } } } } },
      { "kind": "block", "type": "text", "fields": { "TEXT": "Olá" } },
      { "kind": "block", "type": "input" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Números", "colour": 230, "contents": [
      { "kind": "block", "type": "math_number", "fields": { "NUM": 1 } },
      { "kind": "block", "type": "math_arithmetic" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Variáveis", "custom": "VARIABLE", "colour": 330, "contents": [
      { "kind": "block", "type": "variables_get", "fields": { "VAR": { "name": "x" } } },
      { "kind": "block", "type": "variables_set", "fields": { "VAR": { "name": "x" } } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Controle", "colour": 120, "contents": [
      { "kind": "block", "type": "controls_if" },
      { "kind": "block", "type": "controls_repeat_ext" },
      { "kind": "block", "type": "logic_compare" },
    ]},
  ]
};
