import numpy as np

Fthreshold = 10
windowr = 200
Xrange = 1000


def calculate(x, y):
  zz_x, rov = getWeight(x, y)
  rov_best_ind = np.argmax(rov)
  j_rov = np.argmin((x - zz_x[rov_best_ind]) ** 2)
  return [x[j_rov], y[j_rov]]


def getRange(x, y):
  try:
    for value in y:
      print value
    jmax = np.argmin((y - 10 * 1e-9) ** 2)
    jmin = np.argmin((x - (x[jmax] - 1000 * 1e-9)) ** 2)
  except ValueError:
    return False
  return jmin, jmax


def getWeight(x, y):
  jmin, jmax = getRange(x, y)
  winr = 200 * 1e-9
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

