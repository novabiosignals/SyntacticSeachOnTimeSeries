import regex as re
import numpy as np
import scipy.io.arff.arffread as arf
import matplotlib.pyplot as plt
import pandas as pd
from D_gmtools.gm_tools import *

file = "Accelerometer.txt"

acc = np.array(pd.read_csv(file, header=None))
t, m = acc[:, 0], acc[:, 1:-1]
mag = get_magnitude(m)
s = ni.lowpass(mag, 5, order=2, fs=100, use_filtfilt=True)
s = stat_white(s)

#Find amplitude of rising and falling
Rise1, Fall1, Rise2, Fall2, pks = R_F_Amp(s, 3, 3)
#Find amplitudes superior to 3

StrM = [Rise2, Fall2]

STR = mergeChars(StrM)
print(STR)
figure()
plot(s)

for i in re.finditer(r'..11..', STR):
	print(i)
	vlines(pks[i.span()[0] // 2 + 1], ymin=-4, ymax=4, color = 'r')
	vlines(pks[i.span()[0] // 2 + 2], ymin=-4, ymax=4, color = 'g')
	# axvspan(valley[i.span()[0] // 2 - 1], valley[i.span()[1] // 2 -1 ], facecolor='0.5', alpha=0.5)

show()
