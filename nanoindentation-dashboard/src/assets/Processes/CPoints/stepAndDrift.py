from scipy.signal import savgol_filter
import numpy as np

window = 101
threshold = 10
thratio = 25

def calculate(x, y):
  x = [element for element in x]
  y = [element for element in y]
  x = np.array(x)
  y = np.array(y)

  dy = savgol_filter(y,window, 3, deriv=1)
  for j in range(len(dy)):
    if dy[j] > threshold / 1e12:
      break
  for k in range(j, 0, -1):
    if dy[k] < thratio * threshold / 1e14:
      break
  return [x[k], y[k]]
