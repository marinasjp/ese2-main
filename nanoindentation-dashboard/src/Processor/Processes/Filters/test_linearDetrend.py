from linearDetrend import calculate


def test_calculate():
  assert calculate([1, 2, 3]).tolist() == [-8.881784197001252e-16, -4.440892098500626e-16, 0.0]
