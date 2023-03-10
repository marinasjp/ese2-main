import numpy as np

Smooth = 100  # INPUT FROM USER
Lower = 10

# def theory(self, x, *parameters):
#   return parameters[0] * np.ones(len(x))
#
#
# def calculate(self, x, y):
#   full = self.curve._E
#   # This function gets the current x and y and returns the parameters.
#   percentile = Smooth  # Upper
#   lower = Lower  # Lower
#   if percentile < 100:
#     threshold = np.percentile(full, percentile)
#     maxi = np.average(full[full > threshold])
#   else:
#     maxi = np.max(full)
#   min_th = np.percentile(full, lower)
#   mini = np.average(full[full < min_th])
#   return [np.average(y), np.median(full), maxi, mini]
