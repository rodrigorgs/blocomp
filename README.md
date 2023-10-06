# Blocomp

To run:

```
npm install
npm run watch
```

Run a webserver and open `dist/index.html?p=cavalo` in your browser.

## References for development

- [Guide](https://developers.google.com/blockly/guides/overview)
- [Reference](https://developers.google.com/blockly/reference/js/blockly)
- [Plugins](https://google.github.io/blockly-samples/)
- [Block Factory](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html)
- [Code Editor](https://blockly-demo.appspot.com/static/demos/code/index.html)
- [Default blocks](https://github.com/google/blockly/tree/develop/blocks)

See also:

- [Roboblockly](https://roboblocky.com/curriculum/hourofcode/coding/3.php)
- [Puzzles](https://teachinglondoncomputing.org/puzzles/)

## TODO

- [x] Run mode: stop button for debug mode
- [x] Run mode: debug (time interval between blocks)
- [x] Run mode: test (redirect input/output)
- [x] Run mode: debug (step-by-step, with button)
- [.] Run mode: production (run all blocks at once)
- [x] Run mode: test (use cin-like input)
- [ ] Improve run bar: disable run button when code is being run etc.
- [ ] Customize time interval between steps
- [ ] Automatically stop after running and reset the stage

- [x] Save to EZSubmission
- [ ] Export Python code for automatic evaluation

- [x] Load block JSON
- [x] Save generated code to workspace JSON
- [ ] Evaluate using input/output
- [x] Create buttons to create variables

- [x] Use variable-sized editor
- [x] Show input/output in a whatsapp-like chat
- [ ] Show variable values

- [ ] Create grid-based canvas output: can move, read color, paint current block, etc. Like a 2D turing machine.

- [x] Use TypeScript
- [x] "Ask for a number": change block color
- [x] Add color to categories in the toolbox
- [x] Use React (or preact)
