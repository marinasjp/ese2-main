from scipy.signal import savgol_filter


def calculate( x, y, curve=None):
  window = float(25) #window is a user input but 25 is the default value.
  order = 3 #order is a user input but 3 is the default value
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
