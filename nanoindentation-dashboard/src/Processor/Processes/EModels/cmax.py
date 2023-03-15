import numpy as np


def theory(self, x, *parameters):
  return parameters[0] * np.ones(len(x))

# E is the E value returned from espectra.
#Smooth and Lower are both user Inputs
def calculate(x, y, E, Smooth = 100, Lower = 10):
  full = E
  # This function gets the current x and y and returns the parameters.
  percentile = Smooth  # Upper
  lower = Lower  # Lower
  if percentile < 100:
    threshold = np.percentile(full, percentile)
    maxi = np.average(full[full > threshold])
  else:
    maxi = np.max(full)
  min_th = np.percentile(full, lower)
  mini = np.average(full[full < min_th])
  return [np.average(y), np.median(full), maxi, mini]
