// TODO: not tested
const { Test } = require('tape');
const { readInt, readFloat, readLine, readWord } = require('./scanner');

Test('TestScanner', (t) => {
    t.test('test_read_int', (t) => {
        const input1 = '123';
        const input2 = '  -456';
        const input3 = '  0 ';
        t.equal(readInt(input1), 123);
        t.equal(readInt(input2), -456);
        t.equal(readInt(input3), 0);
        t.end();
    });

    t.test('test_read_float', (t) => {
        const input1 = '  3.14  ';
        const input2 = '  -2.718 ';
        const input3 = '  0.0 ';
        t.equal(readFloat(input1), 3.14);
        t.equal(readFloat(input2), -2.718);
        t.equal(readFloat(input3), 0.0);
        t.end();
    });

    t.test('test_read_two_ints', (t) => {
        const input1 = '  123   -456  ';
        t.equal(readInt(input1), 123);
        t.equal(readInt(input1), -456);
        t.end();
    });

    t.test('test_read_two_ints_and_a_word', (t) => {
        const input1 = '  123   -456  hello world';
        t.equal(readInt(input1), 123);
        t.equal(readInt(input1), -456);
        t.equal(readWord(input1), 'hello');
        t.end();
    });

    t.test('test_read_three_words_in_two_lines', (t) => {
        const input1 = '  hello  world  ';
        const input2 = '  goodbye';
        t.equal(readWord(input1), 'hello');
        t.equal(readWord(input1), 'world');
        t.equal(readWord(input2), 'goodbye');
        t.end();
    });
});
