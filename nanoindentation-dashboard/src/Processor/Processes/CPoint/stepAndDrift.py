from scipy.signal import savgol_filter


def calculate(x, y, window = 101, threshold = 10, thratio = 25):
  dy = savgol_filter(y,window, 3, deriv=1)
  for j in range(len(dy)):
    if dy[j] > threshold / 1e12:
      break
  k=j
  for k in range(j, 0, -1):
    if dy[k] < thratio * threshold / 1e14:
      break
  return [x[k], y[k]]
