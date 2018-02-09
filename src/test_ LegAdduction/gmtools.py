from pylab import *
from scipy.signal import medfilt

import numpy as np
import novainstrumentation as ni


def stat_white(s):
    return (s - np.mean(s)) / np.std(s)


def normalization(signal, newMin, newMax, xmin=None, xmax=None):
    if xmin is None:
        xmin = np.min(signal)
    if xmax is None:
        xmax = np.max(signal)
    return (signal - xmin) * (newMax - newMin) / (xmax - xmin) + newMin


def merge_chars(string_matrix):
    """
    Function performs the merge of the strings generated with each method. The function assumes
    that each string is organized in the StringMatrix argument as a column.
    The function returns the merged string.

    """
    col = np.size(string_matrix, axis=0)
    lines = np.size(string_matrix, axis=1)
    Str = ""
    for l in xrange(0, lines):
        for c in xrange(0, col):
            Str += str(string_matrix[c][l])

    return Str


def convert2str(s, f=2, thr=0.25, win_size=51):
    s1 = (s >= np.mean(s) * thr) * 1.

    # Quantization of the derivative
    ds1 = normalization(np.diff(s), -1, 1)
    ds1 = np.clip(np.around(ds1 * f), -1, 1)
    ds1 = medfilt(ds1, win_size)

    x = np.empty(len(ds1), dtype='string')
    x[find(ds1 == -1)] = '-'
    x[find(ds1 == 0)] = '_'
    x[find(ds1 == 1)] = '+'

    # Merge strings in matrix
    Mat = [s1[:-1].astype(int), x]
    Str = merge_chars(Mat)

    return Str


def get_magnitude(s):
    return sqrt(s[:, 0]**2 + s[:, 1]**2 + s[:, 2]**2)