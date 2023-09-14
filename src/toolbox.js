export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    { "kind": "category", "flyoutOpen": true, "name": "E/S", "contents": [
      { "kind": "block", "type": "text_print" },
      { "kind": "block", "type": "text", "fields": { "TEXT": "Olá" } },
      { "kind": "block", "type": "input" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Números", "contents": [
      { "kind": "block", "type": "math_number", "fields": { "NUM": 1 } },
      { "kind": "block", "type": "math_arithmetic" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Variáveis", "custom": "VARIABLE", "contents": [
      { "kind": "block", "type": "variables_get", "fields": { "VAR": { "name": "x" } } },
      { "kind": "block", "type": "variables_set", "fields": { "VAR": { "name": "x" } } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Controle", "contents": [
      { "kind": "block", "type": "controls_if" },
      { "kind": "block", "type": "controls_repeat_ext" },
      { "kind": "block", "type": "logic_compare" },
    ]},
  ]
};
