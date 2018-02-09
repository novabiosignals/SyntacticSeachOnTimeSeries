import numpy as np
import novainstrumentation as ni
import src.test_EcgBeatDetector.wfdbtools as wfdb

from pylab import *

# --- Sequence  definition --- #
start, end = 0, -1
sequence_record = './data/100'

seq_data, seq_info = wfdb.rdsamp(sequence_record, start=start, end=end)
t, ecgsig = seq_data[:, 1], seq_data[:, 2]

s = ni.bandpass(ecgsig, 5, 50, order=2, fs=seq_info['samp_freq'], use_filtfilt=True)
pks = ni.peakdelta(s, delta=np.percentile(s, 98) - np.percentile(s, 2))

figure()
plot(s)
vlines(pks[0][:, 0], np.min(s), np.max(s))

show()
