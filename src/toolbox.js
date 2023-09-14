export const toolbox = {
  // 'kind': "flyoutToolbox",
  "kind": "categoryToolbox",
  "contents": [
    { "kind": "category", "flyoutOpen": true, "name": "E/S", "contents": [
      // { "kind": "label", "text": "Entrada e Saída" },
      { "kind": "block", "type": "text_print" },
      { "kind": "block", "type": "text", "fields": { "TEXT": "Olá" } },
      { "kind": "block", "type": "input" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Números", "contents": [
      // { "kind": "label", "text": "Números" },
      { "kind": "block", "type": "math_number", "fields": { "NUM": 1 } },
      { "kind": "block", "type": "math_arithmetic" },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Variáveis", "custom": "VARIABLE", "contents": [
      // { "kind": "label", "text": "Variáveis" },
      { "kind": "block", "type": "variables_get", "fields": { "VAR": { "name": "x" } } },
      { "kind": "block", "type": "variables_set", "fields": { "VAR": { "name": "x" } } },
    ]},
    { "kind": "category", "flyoutOpen": true, "name": "Controle", "contents": [
      // { "kind": "label", "text": "Controle" },
      { "kind": "block", "type": "controls_if" },
      { "kind": "block", "type": "controls_repeat_ext" },
      { "kind": "block", "type": "logic_compare" },
    ]},
  ]
};



//     "contents": [




//       // { "kind": "label", "text": "Outros" },
//       // { "kind": "block", "type": "esperar" },
//       // { "kind": "block", "type": "procedures_defnoreturn" },
//       // { "kind": "block", "type": "procedures_callnoreturn" },
//     ]
// };
