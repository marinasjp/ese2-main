import numpy as np
from scipy.signal import savgol_filter

window = 101  # INPUT FROM USER
threshold = 10


def calculate(x, y):
  x_base, y_base = get_baseline(x, y)
  m, q = np.polyfit(x_base, y_base, 1)
  return x, y - m * x - q


def get_baseline(x, y):
  dy = savgol_filter(y, window, 3, deriv=1)
  for j in range(len(dy)):
    if dy[j] > threshold / 1e12:
      break
  for k in range(j, 0, -1):
    if dy[k] < 0:
      break
  return [x[:k], y[:k]]
