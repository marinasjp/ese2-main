from stepAndDrift import calculate

def test_calculate():
  x = [4, 5, 7, 2, 23, 6, 7, 32]
  test_array = [4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324,
                2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23,
                324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5,
                23, 6, 7, 32]
  assert calculate(x,test_array, len(test_array)) == [4,4]

