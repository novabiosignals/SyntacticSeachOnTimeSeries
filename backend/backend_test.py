import sys
import regex as re
import pandas as pd
import gotstools as gt

from pylab import *
import wfdbtools as wfdb

def vmagnitude(v):
    """
    Returns the magnitude of a tridimensional vector signal.
    :param v: (ndarray-like)

    :return: The magnitude of the signal.
    """
    return np.sqrt(v[:, 0] ** 2 + v[:, 1] ** 2 + v[:, 2] ** 2)


seq_data, seq_info = wfdb.rdsamp('../examples/data/EcgBeatDetection/100', start=0, end=10)
t, s = seq_data[:, 1], seq_data[:, 2]

cfg = {
  "pre_processing": "☲ 5 50 360",
  "connotation": "† 0.01",
  "expression": "\+-"
}
matches = gt.ssts(s, cfg, report='full')
