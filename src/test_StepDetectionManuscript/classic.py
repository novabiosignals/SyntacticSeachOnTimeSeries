import numpy as np
import pandas as pd
import novainstrumentation as ni

from gmtools import *

close('all')

vm = np.array(pd.read_csv('data/test2/Accelerometer.txt', header=None))
taps = np.array(pd.read_csv('data/test2/TapCounter.txt', header=None))
t, m = vm[:, 0], vm[:, 1:-1]
mag = get_magnitude(m)

s = ni.lowpass(mag, 2, order=2, fs=100, use_filtfilt=True)

# Find all minimum peaks
pks = ni.peakdelta(s, delta=np.percentile(s, 70) - np.percentile(s, 30))
stepsl = []
stepsr = []
medsteps = np.median(pks[1][:, 1])
for (i, p) in zip(pks[1][:, 0], pks[1][:, 1]):
    if p <= medsteps:
        stepsl += [[i, p]]
    else:
        stepsr += [[i, p]]

stepsl = np.array(stepsl)
stepsr = np.array(stepsr)

# Visualization
# figure()
# plot(t, s)
# scatter(t[stepsl[:, 0].astype(int)], stepsl[:, 1], color='g', label='stepsl')
# scatter(t[stepsr[:, 0].astype(int)], stepsr[:, 1], color='r', label='stepsr')
# vlines(taps[:, 0].astype(int), np.min(s), np.max(s), color='k', label='groundtruth')
# legend()

show()
