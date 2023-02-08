import numpy as np


def theory(x, *parameters):
  return parameters[0] * np.ones(len(x))


def calculate(x, y):
  # This function gets the current x and y and returns the parameters.
  return [np.average(y)]
