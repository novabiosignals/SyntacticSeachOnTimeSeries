import regex as re
import pandas as pd
from gmtools import *

vm = np.array(pd.read_csv('Magnetometer.txt', header=None))
t, m = vm[:, 0], vm[:, 1:-1]
mag = get_magnitude(m)

s = ni.lowpass(mag, 5, order=2, fs=100, use_filtfilt=True)
s = stat_white(s)

Str = convert2str(s)

figure()
plot(s)
for i in re.finditer(r'(._.-)', Str):
    vlines(i.span()[0] // 2, 0, 1, colors='k')

for i in re.finditer(r'(.\+._)', Str):
    vlines(i.span()[0] // 2, 0, 1, colors='r')

show()
