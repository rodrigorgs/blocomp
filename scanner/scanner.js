// TODO: not tested
let _buffer = '';

function _feed_buffer() {
    while (_buffer.trim().length === 0) {
        _buffer = prompt();
    }
}

function _read_number(number_type) {
    _feed_buffer();

    const match = _buffer.match(/\s*(-?\d+([.]\d+)?)*/);
    if (match) {
        _buffer = _buffer.slice(match[0].length);
        return number_type(match[1]);
    } else {
        throw new Error('Expected integer');
    }
}

function read_int() {
    return _read_number(parseInt);
}

function read_float() {
    return _read_number(parseFloat);
}

function read_line() {
    _feed_buffer();
    return _buffer;
}

function read_word() {
    _feed_buffer();

    const match = _buffer.match(/\s*([^\s]+)*/);
    if (match) {
        _buffer = _buffer.slice(match[0].length);
        return match[1];
    } else {
        throw new Error();
    }
}
