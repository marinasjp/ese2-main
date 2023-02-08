import numpy as np
from scipy.signal import savgol_filter

#Hardcoded Input
window = 20.0
xRange = 1000.0
fThreshold = 10.0

def calculate(x, y):
  zz_x, ddf = getWeight(x, y)
  ddf_best_ind = np.argmin(ddf)
  jdd = np.argmin((x - zz_x[ddf_best_ind]) ** 2)
  return [x[jdd], y[jdd]]


def getRange(x, y):
  try:
    jmax = np.argmin((y - fThreshold * 1e-9) ** 2)
    jmin = np.argmin((x - (x[jmax] - xRange * 1e-9)) ** 2)
  except ValueError:
    return False
  return jmin, jmax


def getWeight(x, y):
  jmin, jmax = getRange(x, y)
  if jmin is False:
    return False
  win = window * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(win / xstep)
  if win % 2 == 0:
    win += 1
  fsecond = savgol_filter(y, polyorder=4, deriv=2, window_length=win)
  return x[jmin:jmax], fsecond[jmin:jmax]
