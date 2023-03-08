import numpy as np
from scipy.optimize import curve_fit


def theory(x, *parameters, poisson = 0.5, geometry = 'sphere', radius = 1, angle = 1):
  if geometry == 'sphere':
    R = radius
    return parameters[1] * x + (4.0 / 3.0) * (parameters[0] / (1 - poisson ** 2)) * np.sqrt(R * x ** 3)
  elif geometry == 'pyramid':
    ang = angle  # see DOI for definition
    return parameters[1] * x + 0.7453 * (
      (parameters[0] * np.tan(ang * np.pi / 180.0)) / (1 - poisson ** 2)) * x ** 2
  elif geometry == 'cylinder':
    R = radius
    return parameters[1] * x + (2.0 / 1.0) * (parameters[0] / (1 - poisson ** 2)) * (R * x)
  elif geometry == 'cone':
    ang = angle
    return parameters[1] * x + (2.0 / 1.0) * (
      (parameters[0] * np.tan(ang * np.pi / 180.0)) / (np.pi * (1 - poisson ** 2))) * x ** 2
  else:
    return False


def calculate(x, y):
  # This function gets the current x and y and returns the parameters.
  try:
    popt, pcov = curve_fit(theory, x, y, p0=[1000, 1], maxfev=1000)
  except RuntimeError:
    return False
  return popt
