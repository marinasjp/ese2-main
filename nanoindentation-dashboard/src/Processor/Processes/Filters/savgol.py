from scipy.signal import savgol_filter

# window and order are user inputs
def calculate(x, y, window=25, order=3):
  win = window * 1e-9
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = int(win / xstep)
  polyorder = order
  if win % 2 == 0:
    win += 1
  if polyorder > win:
    return False
  y_smooth = savgol_filter(y, win, polyorder)
  return x, y_smooth
