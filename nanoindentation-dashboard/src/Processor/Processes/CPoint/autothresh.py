import numpy as np

#User Input
ZeroRange = 500.0

def calculate(x, y):
  deg = 0
  worky = np.copy(y)
  xtarget = np.min(x) + ZeroRange * 1e-9
  jtarget = np.argmin(np.abs(x - xtarget))

  # which direction?
  if x[0] < x[-1]:
    xlin = x[:jtarget]
    ylin = worky[:jtarget]
    m, q = np.polyfit(xlin, ylin, 1)
  else:
    xlin = x[jtarget:]
    ylin = worky[jtarget:]
    m, q = np.polyfit(xlin, ylin, 1)

  worky = worky - m * x - q

  differences = (worky[1:] + worky[:-1]) / 2
  midpoints = np.array(list(set(differences)))
  midpoints.sort()

  crossings = []
  for threshold in midpoints[midpoints > 0]:
    crossings.append(np.sum(np.bitwise_and((worky[1:] > threshold), (worky[:-1] < threshold))))
  crossings = np.array(crossings)

  inflection = midpoints[midpoints > 0][np.where(crossings == 1)[0][0]]
  jcpguess = np.argmin(np.abs(differences - inflection)) + 1

  xcp = x[jcpguess]
  ycp = y[jcpguess]
  return [xcp, ycp]
