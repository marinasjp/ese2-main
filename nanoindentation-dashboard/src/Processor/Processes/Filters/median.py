import numpy as np
from scipy.signal import medfilt

window = 25   # INPUT FROM USER
def calculate(x, y):
  win = window * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(win / xstep)
  if win % 2 == 0:
    win += 1
  xfiltered = x
  yfiltered = medfilt(y, win)
  return xfiltered, yfiltered
