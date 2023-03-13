import numpy as np
from scipy.interpolate import interp1d
from scipy.signal import savgol_filter


# Zi and Fi are calculated and returned from calc_indentation
# Geometry is a user input
# radius is a user input
# win is like a slice/window of the data that you want to use, user input

def calculate(Zi, Fi, geometry, radius, win, order, interp=True):
  x = Zi  # From calc indentation
  y = Fi
  if (len(x)) < 1:  # check on length of ind
    return None
  if interp is True:
    yi = interp1d(x, y)
    max_x = np.max(x)
    min_x = 1e-9
    if np.min(x) > 1e-9:
      min_x = np.min(x)
    xx = np.arange(min_x, max_x, 1.0e-9)
    yy = yi(xx)
    ddt = 1.0e-9
  else:
    xx = x[1:]
    yy = y[1:]
    ddt = (x[-1] - x[1]) / (len(x) - 2)

  if geometry == 'sphere':
    R = radius
    area = np.pi * xx * R
    # contactradius = np.sqrt(xx * R)
    coeff = 3 * np.sqrt(np.pi) / 8 / np.sqrt(area)
  elif geometry == 'cylinder':
    R = radius
    coeff = 3 / 8 / R
  else:
    return False
  if win % 2 == 0:
    win += 1
  if len(yy) <= win:
    return False
  deriv = savgol_filter(yy, win, order, delta=ddt, deriv=1)
  Ey = coeff * deriv
  dwin = int(win - 1)
  Ex = xx[dwin:-dwin]  # contactradius[dwin:-dwin]
  Ey = Ey[dwin:-dwin]

  Ze = np.array(Ex)
  E = np.array(Ey)
  return Ze, E
