import numpy as np
from scipy.signal import savgol_filter
from scipy.interpolate import interp1d

#Inputs, they look like they are hardcoded agian and not a user input
Athreshold = 0.0005
deltaX = 2000.0
Fthreshold = 100.0


def calculate(self, x, y):
  # calculates CP baed on prime function threshold
  primeth = Athreshold
  z_false, prime = self.getWeight(x, y)
  xstep = (max(x) - min(x)) / (len(x) - 1)
  win = 31 * 1e-9
  win = int(win / xstep)
  fi = interp1d(x, y)
  z = np.linspace(min(x), max(x), len(x))
  f = fi(z)
  z = z[win:-win]
  f = f[win:-win]
  if primeth > np.max(prime) or primeth < np.min(prime):
    return False
  jrov = 0
  for j in range(len(prime) - 1, 1, -1):
    if prime[j] > primeth and prime[j - 1] < primeth:
      jrov = j
      break
  x0 = z[jrov]
  dx = deltaX * 1e-9
  ddx = Fthreshold * 1e-9
  if ddx <= 0:
    jxalign = np.argmin((z - (x0 - dx)) ** 2)
    dS0 = prime[jxalign]
  else:
    jxalignLeft = np.argmin((z - (x0 - dx - ddx)) ** 2)
    jxalignRight = np.argmin((z - (x0 - dx + ddx)) ** 2)
    dS0 = np.average(prime[jxalignLeft:jxalignRight])
  jcp = jrov
  for j in range(jrov, 1, -1):
    if prime[j] > dS0 and prime[j - 1] < dS0:
      jcp = j
      break
  return [z[jcp], f[jcp]]


def getWeight(self, x, y):
  # Weight is the prime function
  z = x
  f = y
  try:
    win = 31 * 1e-9  # arbitrary (insert as input parameter?)
    xstep = (max(x) - min(x)) / (len(x) - 1)
    win = int(win / xstep)
    order = 4  # arbitrary (insert as input parameter?)
    fi = interp1d(z, f)
    zz = np.linspace(min(z), max(z), len(z))
    ff = fi(zz)
    dz = z[1] - z[0]
    dfdz = savgol_filter(ff, win, order, delta=dz,
                         deriv=1)
    S = dfdz / (1 - dfdz)  # c.k in denominator makes it unstable
  except:
    return False
  return z[win:-win], S[win:-win]
