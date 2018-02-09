import regex as re
import pandas as pd
from gmtools import *

vm = np.array(pd.read_csv('Accelerometer.txt', header=None))
t, m = vm[:, 0], vm[:, 1:-1]
mag = get_magnitude(m)

s = ni.lowpass(mag, 5, order=2, fs=100, use_filtfilt=True)
s = stat_white(s)

Str = convert2str(s, win_size=11)

figure()
plot(s)
for i in re.finditer(r'(.\_){5,}(.\+){5,}(.\_){1,5}(.\-){5,}', Str):
    print i
    axvspan(i.span()[0] // 2, i.span()[1] // 2, facecolor='0.5', alpha=0.5)

show()
