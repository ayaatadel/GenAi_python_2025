import unittest
from ai import sort_numbers_in_array, add_two_numbers, devide_two_numbers

class TestAiFunctions(unittest.TestCase):
    def test_sort_numbers_in_array(self):
        self.assertEqual(sort_numbers_in_array([3, 1, 2]), [1, 2, 3])
        self.assertEqual(sort_numbers_in_array([]), [])
        self.assertEqual(sort_numbers_in_array([-1, 5, 0]), [-1, 0, 5])

    def test_add_two_numbers(self):
        self.assertEqual(add_two_numbers(2, 3), 5)
        self.assertEqual(add_two_numbers(-1, 1), 0)
        self.assertEqual(add_two_numbers(0, 0), 0)

    def test_devide_two_numbers(self):
        self.assertEqual(devide_two_numbers(6, 2), 3)
        self.assertEqual(devide_two_numbers(5, 2), 2.5)
        self.assertEqual(devide_two_numbers(0, 1), 0)
        self.assertEqual(devide_two_numbers(1, 0), "Error: Division by zero is not allowed.")

if __name__ == '__main__':
    unittest.main()
