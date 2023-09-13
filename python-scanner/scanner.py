import re

_buffer = ''

def _feed_buffer():
    global _buffer
    while len(_buffer.strip()) == 0:
        _buffer = input()

def _read_number(number_type):
    global _buffer
    _feed_buffer()

    if match := re.match(r'\s*(-?\d+([.]\d+)?)', _buffer):            
        _buffer = _buffer[match.end():]
        return number_type(match.group(1))
    else:
        raise ValueError('Expected integer')

def read_int():
    return _read_number(int)
def read_float():
    return _read_number(float)

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