# Blockly-ILP

To run:

```
npm install
npm run watch
```

Run a webserver and open `dist/index.html` in your browser.

## References for development

- [Guide](https://developers.google.com/blockly/guides/overview)
- [Reference](https://developers.google.com/blockly/reference/js/blockly)
- [Plugins](https://google.github.io/blockly-samples/)
- [Block Factory](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html)
- [Code Editor](https://blockly-demo.appspot.com/static/demos/code/index.html)

See also:

- [Roboblockly](https://roboblocky.com/curriculum/hourofcode/coding/3.php)
- [Puzzles](https://teachinglondoncomputing.org/puzzles/)

## TODO

- [x] Load block JSON
- [x] Save generated code to workspace JSON
- [x] Evaluate using input/output
- [x] Create buttons to create variables
- [ ] Save to EZSubmission

- [ ] Show variable values
- [ ] Use variable-sized editor
- [x] Run mode: debug (time interval between blocks)
- [x] Run mode: test (redirect input/output)
- [ ] Run mode: debug (step-by-step, with button)
- [ ] Run mode: production (run all blocks at once)
- [ ] Run mode: test (use cin-like input)
- [ ] Create grid-based canvas output: can move, read color, paint current block, etc. Like a 2D turing machine.

- [ ] Use TypeScript
- [ ] Use React (or preact)