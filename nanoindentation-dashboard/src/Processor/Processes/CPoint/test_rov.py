from rov import calculate
import numpy as np


def test_calculate():
  test_array = []
  test_array2 = []
  f = open("data.csv", "r")
  for x in f:
    xArr = x.split(",")
    test_array.append(float(xArr[1]))
    test_array2.append(float(xArr[4]))
  f.close()
  print(test_array)
  print(test_array2)
  assert calculate(np.array(test_array),np.array(test_array2)) == [-0.007434, 4.354564]
