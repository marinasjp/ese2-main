import numpy as np

#User Inputs
deltaX = 2000
Athreshold = 10
Fthreshold = 100
shift = 0


def calculate(x, y):
  yth = Athreshold * 1e-9
  if yth > np.max(y) or yth < np.min(y):
    return False
  jrov = 0
  for j in range(len(y) - 1, 1, -1):
    if y[j] > yth and y[j - 1] < yth:
      jrov = j
      break
  if jrov == 0 or jrov == len(y) - 1:
    return False
  x0 = x[jrov]
  dx = deltaX * 1e-9
  ddx = Fthreshold * 1e-9
  if ddx <= 0:
    jxalign = np.argmin((x - (x0 - dx)) ** 2)
    f0 = y[jxalign]
  else:
    jxalignLeft = np.argmin((x - (x0 - dx - ddx)) ** 2)
    jxalignRight = np.argmin((x - (x0 - dx + ddx)) ** 2)
    f0 = np.average(y[jxalignLeft:jxalignRight])
  jcp = jrov
  for j in range(jrov, 1, -1):
    if y[j] > f0 > y[j - 1]:
      jcp = j
      break
  if jcp == 0:
    return False
  sh = shift * 1e-9
  xcp = x[jcp] + sh
  ycp = y[np.argmin((x - xcp) ** 2)]
  return [xcp, ycp]
