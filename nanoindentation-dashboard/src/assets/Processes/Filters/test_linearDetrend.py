from linearDetrend import calculate


def test_calculate():
  assert calculate([1, 2, 3]) == [11, 12, 13]
