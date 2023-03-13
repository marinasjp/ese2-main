import numpy as np

# Z and F are the displacement and force of the curve
# CP is calculated and returned from any CPoint proccess
# I think spring_constant is also a user input

def calculate(Z, F, CP, spring_constant=1, setzeroforce=True):
  iContact = np.argmin((Z - CP[0]) ** 2)
  if setzeroforce is True:
    Yf = F[iContact:] - CP[1]
  else:
    Yf = F[iContact:]
  Xf = Z[iContact:] - CP[0]
  Zi = Xf - Yf / spring_constant
  Fi = Yf
  return Zi, Fi
