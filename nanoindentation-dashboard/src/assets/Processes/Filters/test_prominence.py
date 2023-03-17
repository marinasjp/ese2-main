import numpy as np
from prominence import calculate


def test_calculate():
  x = calculate([4, 5, 7, 2, 23, 6, 7, 32], [1, 2, 3, 4, 3, 2, 1, 0, -0.5, -2, 0, 5, 10, 20, 30, 40, -1, -2], [30, 40, 25])
  assert x is None

  test_array = [4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7,
           2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7,
           324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2,
           23, 6, 7, 32]
  x, y = calculate([4, 5, 7, 2, 23, 6, 7, 32], test_array, [30, 40, 25])
  assert x == [4, 5, 7, 2, 23, 6, 7, 32]
  assert y.tolist() == [4.000000000000009, 5.000000000000009, 7.000000000000008, 2.000000000000031,
                        23.000000000000014, 6.0000000000000036, 7.000000000000003, 31.999999999999993,
                        4.000000000000036,
                        4.999999999999986, 7.000000000000015,
                        2.0000000000000044,
                        22.99999999999998,
                        6.000000000000009,
                        7.000000000000016,
                        31.999999999999964,
                        4.00000000000001,
                        4.99999999999997,
                        7.000000000000011,
                        1.999999999999999,
                        22.999999999999993,
                        6.000000000000012,
                        7.000000000000036,
                        324.00000000000006,
                        5.000000000000025,
                        7.000000000000038,
                        1.9999999999999956,
                        22.999999999999982,
                        5.999999999999996,
                        6.9999999999999645,
                        324.0,
                        4.9999999999999964,
                        7.000000000000042,
                        2.0000000000000213,
                        23.0,
                        5.99999999999998,
                        7.0,
                        324.0,
                        4.999999999999958,
                        7.000000000000028,
                        2.000000000000049,
                        22.999999999999982,
                        6.000000000000062,
                        6.999999999999928,
                        324.0,
                        4.999999999999995,
                        7.000000000000009,
                        1.9999999999999913,
                        23.00000000000002,
                        6.000000000000016,
                        7.0,
                        324.0,
                        4.999999999999996,
                        7.000000000000035,
                        2.0000000000000235,
                        23.000000000000036,
                        5.9999999999999964,
                        6.999999999999982,
                        323.99999999999994,
                        4.999999999999983,
                        7.000000000000003,
                        2.000000000000059,
                        23.000000000000018,
                        5.999999999999984,
                        6.999999999999946,
                        324.0,
                        4.9999999999999645,
                        7.000000000000033,
                        2.0000000000000027,
                        23.000000000000014,
                        5.999999999999996,
                        6.999999999999982,
                        323.99999999999994,
                        4.999999999999996,
                        6.999999999999974,
                        1.9999999999999933,
                        22.999999999999993,
                        6.000000000000025,
                        6.9999999999999645,
                        324.00000000000006,
                        5.000000000000008,
                        7.000000000000018,
                        1.9999999999999742,
                        23.000000000000018,
                        6.000000000000028,
                        6.999999999999992,
                        324.00000000000006,
                        4.999999999999982,
                        6.9999999999999885,
                        1.9999999999999956,
                        23.00000000000001,
                        5.999999999999983,
                        6.999999999999954,
                        324.00000000000006,
                        5.000000000000007,
                        6.999999999999998,
                        2.0000000000000235,
                        22.999999999999996,
                        5.999999999999996,
                        7.0000000000000195,
                        32.00000000000002]
