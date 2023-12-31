import re

_buffer = ''

def _feed_buffer():
    global _buffer
    while len(_buffer.strip()) == 0:
        _buffer = input()

def read_number(number_type = None):
    global _buffer
    _feed_buffer()

    if match := re.match(r'\s*(-?\d+([.]\d+)?)', _buffer):            
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
    if match := re.match(r'\s*([^\s]+)', _buffer):            
        _buffer = _buffer[match.end():]
        return match.group(1)
    else:
        raise ValueError()