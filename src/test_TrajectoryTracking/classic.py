import numpy as np
import pandas as pd
import novainstrumentation as ni

from gmtools import *

close('all')

mapxy = np.array(pd.read_csv('./data/coord_demo3.txt', header=None))
x, y = mapxy[:, 0], mapxy[:, 1]
nx, ny = ni.smooth(x, 70), ni.smooth(y, 70)

dnx = np.diff(nx)
dny = np.diff(ny)

# Detection of straight segments
idx = dnx != 0
idy = dny == 0
vals = (idx * idy) + (~idx * ~idy)

figure()
subplot(131)
plot(nx, ny)
scatter(nx[vals], ny[vals], color='r')

# Looping detection
maxs_ny = ni.peaks(ny)
mins_ny = ni.peaks(-ny)

maxs_nx = ni.peaks(nx)
mins_nx = ni.peaks(-nx)

subplot(132)
plot(nx, ny)
scatter(nx[maxs_ny], ny[maxs_ny], color='r')
scatter(nx[mins_ny], ny[mins_ny], color='g')
scatter(nx[maxs_nx], ny[maxs_nx], color='b')
scatter(nx[mins_nx], ny[mins_nx], color='k')

e = hstack([maxs_ny, mins_ny, maxs_nx, mins_nx])
mask = hstack([ones(len(maxs_ny)), ones(len(mins_ny)), zeros(len(maxs_nx)), zeros(len(mins_nx))])
estack = vstack((e, mask)).T
estack = estack[argsort(estack[:, 0])]


loops = []
filtvalues = []
for i in range(len(estack) - 1):
    if estack[i+1][1] != estack[i][1]:
        filtvalues += [int(estack[i][0])]
    else:
        if estack[i][0] - estack[i-1][0] < 40:
            filtvalues += [int(estack[i][0])]

subplot(133)
plot(nx, ny)
for i in [0, 4, 8]:
    scatter(nx[arange(filtvalues[i], filtvalues[i+3]+1)],
            ny[arange(filtvalues[i], filtvalues[i+3]+1)])

show()
