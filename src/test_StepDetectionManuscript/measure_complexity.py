import pytest
import textwrap

from radon.visitors import HalsteadVisitor
from radon.metrics import h_visit

dedent = lambda code: textwrap.dedent(code).strip()
testCode = """
    mag = get_magnitude(m)
    
    s = ni.lowpass(mag, 2, order=2, fs=100, use_filtfilt=True)
    
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
"""

measures = ['h1', 'h2', 'N1', 'N2', 'vocabulary', 'length',
            'calculated_length', 'volume', 'difficulty', 'effort', 'time', 'bugs']

# execute the h_visit method, which gives you a Halstead module with all the complexity measures
visitor = h_visit(dedent(testCode))
print(visitor)

