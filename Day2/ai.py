#generate function to sort numbers in array in ascending order
def sort_numbers_in_array(arr):
    return sorted(arr)
#generate function that add two numbers
def add_two_numbers(a, b):
    return a + b    

def devide_two_numbers(a, b):
    """
    Divide two numbers and handle division by zero.
    Returns the result if successful, or a string error message if division by zero occurs.
    """
    try:
        return a / b
    except ZeroDivisionError:
        return "Error: Division by zero is not allowed."