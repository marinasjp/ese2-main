import numpy as np


def calculate(x, y):
  zz_x, rov = getWeight(x, y)
  print(zz_x)
  print(rov)
  rov_best_ind = np.argmax(rov)
  j_rov = np.argmin((x - zz_x[rov_best_ind]) ** 2)
  return [x[j_rov], y[j_rov]]


def getRange(x, y, Fthreshold = 10, Xrange = 1000):
  try:
    jmax = np.argmin((y - Fthreshold * 1e-9) ** 2)
    jmin = np.argmin((x - (x[jmax] - Xrange * 1e-9)) ** 2)
  except ValueError:
    return False
  return jmin, jmax


def getWeight(x, y, windowr = 200):
  jmin, jmax = getRange(x, y)
  winr = windowr * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(winr / xstep)
  if (len(y) - jmax) < int(win):
    return False
  if (jmin) < int(win):
    return False
  rov = []
  for j in range(jmin, jmax):
    rov.append((np.var(y[j + 1: j + win])) / (np.var(y[j - win: j - 1])))
  return x[jmin:jmax], rov


# test_array = [4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 32, 4, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324,
#                 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23,
#                 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5, 7, 2, 23, 6, 7, 324, 5,
#                 23, 6, 7, 32]
# calculate(np.array(test_array), np.array([1, 2, 1e-09, 3, 1e-08, 1]))
