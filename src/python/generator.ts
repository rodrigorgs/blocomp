import * as Blockly from 'blockly';
import { Order, pythonGenerator } from "blockly/python";

const pythonScanner = `
import re

_buffer = ''

def _feed_buffer():
    global _buffer
    while len(_buffer.strip()) == 0:
        _buffer = input()

def read_number(number_type = None):
    global _buffer
    _feed_buffer()

    if match := re.match(r'\\s*(-?\\d+([.]\\d+)?)', _buffer):            
        _buffer = _buffer[match.end():]
        if number_type is None:
            if '.' in match.group(1):
                return float(match.group(1))
            else:
                return int(match.group(1))
        else:
            return number_type(match.group(1))
    else:
        raise ValueError('Expected integer')

def read_int():
    return read_number(int)
def read_float():
    return read_number(float)

def read_line():
    global _buffer
    _feed_buffer()
    return _buffer

def read_word():
    global _buffer
    _feed_buffer()
    if match := re.match(r'\\s*([^\\s]+)', _buffer):            
        _buffer = _buffer[match.end():]
        return match.group(1)
    else:
        raise ValueError()
`

export function loadPythonGenerator() { 
    pythonGenerator.forBlock['text_print'] = function (block: Blockly.Block, generator: any) {
        const msg = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";

        return `print(${msg});\n`;
    }

    pythonGenerator.forBlock['input'] = function(block: Blockly.Block, generator: any) {
        var variable_var = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
        const msg = `Digite um ${block.getFieldValue('TYPE')} para guardar como ${variable_var}`;
        const msgJSON = JSON.stringify(msg);
        let code = ``;
        if (block.getFieldValue('TYPE') === 'NUMBER') {
            code += `${variable_var} = read_number()\n`;
            // code += `${variable_var} = float(input())\n`;
        } else if (block.getFieldValue('TYPE') === 'WORD') {
            code += `${variable_var} = read_word()\n`;
        } else {
            // code += `${variable_var} = input()\n`;
            code += `${variable_var} = read_line()\n`;
        }
        return code;
    };

    pythonGenerator.forBlock['input_question'] = pythonGenerator.forBlock['input']

    pythonGenerator.forBlock['math_arithmetic'] = function(block: Blockly.Block, generator: any) {
        // Basic arithmetic operators, and power.
        const OPERATORS: {[index: string]: Array<string|number>} = {
            'ADD': [' + ', Order.ADDITIVE],
            'MINUS': [' - ', Order.ADDITIVE],
            'MULTIPLY': [' * ', Order.MULTIPLICATIVE],
            'DIVIDE': [' / ', Order.MULTIPLICATIVE],
            'POWER': [' ** ', Order.EXPONENTIATION],
        };
        const tuple = OPERATORS[block.getFieldValue('OP')];
        const operator = tuple[0];
        const order = tuple[1];
        const argument0 = generator.valueToCode(block, 'A', order) || '0';
        const argument1 = generator.valueToCode(block, 'B', order) || '0';

        const code = argument0 + operator + argument1;
        return [code, order];
        // In case of 'DIVIDE', division between integers returns different results
        // in generator 2 and 3. However, is not an issue since Blockly does not
        // guarantee identical results in all languages.  To do otherwise would
        // require every operator to be wrapped in a function call.  This would kill
        // legibility of the generated code.
    }

    pythonGenerator.forBlock['round'] = function (block: Blockly.Block, generator: any) {
        const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
        const precision = block.getFieldValue('PRECISION');

        console.log('precision', precision);
        
        let code = '';
        if (precision == 0) {
            code = `round(${numericExpression})`;
        } else {
            code = `round(${numericExpression}, ${precision})`;
        }
    
        return [code, Order.FUNCTION_CALL];
      };

      pythonGenerator.forBlock['truncate'] = function (block: Blockly.Block, generator: any) {
        const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
        
        const code = `int(${numericExpression})`;
    
        return [code, Order.FUNCTION_CALL];
      };

      pythonGenerator.forBlock['format'] = function (block: Blockly.Block, generator: any) {
        const numericExpression = generator.valueToCode(block, 'NUMBER', Order.ATOMIC);
        const precision = block.getFieldValue('PRECISION');
        
        const code = 'f"{' + numericExpression + ':.' + precision + 'f}"';
    
        return [code, Order.FUNCTION_CALL];
      };
    
}

function detectNumericType(s: string) {
    if (s.match(/-?\d+[.]\d+/)) {
        return 'float';
    } else if (s.match(/-?\d+/)) {
        return 'int';
    }
}

export function generatePythonCode(workspace: Blockly.Workspace) {
    return `import math\n` + pythonScanner + '\n' + pythonGenerator.workspaceToCode(workspace);   
}