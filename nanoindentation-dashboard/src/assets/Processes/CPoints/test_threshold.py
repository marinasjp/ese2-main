from threshold import calculate
import numpy as np


def test_calculate():
  assert calculate([4, 5, 7, 2, 23, 6, 7, 32], [1, 2, 3, 4, 3, 2, 1]) is False

  assert calculate([4, 5, 7, 2, 23, 6, 7, 32], [1, 2, 3, 4, 3, 1e-08, 1]) is False

  assert calculate(np.array([4, 5, 7, 2, 23, 6, 7, 32]), np.array([1, 2, 1e-09, 3, 1e-08, 1])) == [2.0, 3.0]
