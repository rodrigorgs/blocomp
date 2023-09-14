import unittest
from unittest.mock import patch
from scanner import read_int, read_float, read_line, read_word

class TestScanner(unittest.TestCase):
    def test_read_int(self):
        with patch('builtins.input', return_value='123'):
            self.assertEqual(read_int(), 123)

        with patch('builtins.input', return_value = '  -456'):
            self.assertEqual(read_int(), -456)

        with patch('builtins.input', return_value = '  0 '):
            self.assertEqual(read_int(), 0)

    def test_read_float(self):
        with patch('builtins.input', return_value = '  3.14  '):
            self.assertEqual(read_float(), 3.14)

        with patch('builtins.input', return_value = '  -2.718 '):
            self.assertEqual(read_float(), -2.718)

        with patch('builtins.input', return_value = '  0.0 '):
            self.assertEqual(read_float(), 0.0)

    def test_read_two_ints(self):
        with patch('builtins.input', return_value = '  123   -456  '):
            self.assertEqual(read_int(), 123)
            self.assertEqual(read_int(), -456)
    
    def test_read_two_ints_and_a_word(self):
        with patch('builtins.input', return_value = '  123   -456  hello world'):
            self.assertEqual(read_int(), 123)
            self.assertEqual(read_int(), -456)
            self.assertEqual(read_word(), 'hello')

    def test_read_three_words_in_two_lines(self):
        with patch('builtins.input', side_effect = ['  hello  world  ', '  goodbye']):
            self.assertEqual(read_word(), 'hello')
            self.assertEqual(read_word(), 'world')
            self.assertEqual(read_word(), 'goodbye')
    # def test_read_two_ints_and_a_phrase(self):
    #     with patch('builtins.input', return_value = '  123   -456  hello world'):
    #         self.assertEqual(read_int(), 123)
    #         self.assertEqual(read_int(), -456)
    #         self.assertEqual(read_line(), 'hello world')
        

    # def test_read_line(self):
    #     # Test reading a single line
    #     self.assertEqual(read_line(), 'Hello, world!\n')

    #     # Test reading multiple lines
    #     self.assertEqual(read_line(), 'This is the first line.\n')
    #     self.assertEqual(read_line(), 'This is the second line.\n')

    # def test_read_word(self):
    #     # Test reading a single word
    #     self.assertEqual(read_word(), 'apple')

    #     # Test reading a word with spaces before and after
    #     self.assertEqual(read_word(), 'banana')

    #     # Test reading a word with special characters
    #     self.assertEqual(read_word(), 'c++')

if __name__ == '__main__':
    unittest.main()