import textwrap

import pytest

from radon.visitors import HalsteadVisitor
from radon.metrics import h_visit

#dedent (Remove any common leading whitespace from every line in `text`)
dedent = lambda code: textwrap.dedent(code).strip()

#simple code as a string (should save the indents)
testCode = 
"""bts = st[1]
Indpks = st[2]
# print(n)

for nBeat in range(0, len(bts)):
    hBeatInTest = bts[nBeat]
    distancia = bts[0][nBeat]
    indRPeak = Indpks[nBeat]

    print(distancia > (sts[1] + 0.5 * sts[2]))

    if ((np.max(hBeatInTest) > (1.5 * sts[4]) and (np.min(hBeatInTest) < (1.5 * sts[3])))
        or (distancia > (sts[1] + 0.5*sts[2])) or (np.argmax(hBeatInTest) != indRPeak)):
        outlierBeats.append(nBeat + TemplatePks * n)

print(outlierBeats)"""

#execute the h_visit method, which gives you a Halstead module with all the complexity measures
visitor = h_visit(dedent(code))

""" visitor.N1 = 15
    visitor.N2 = 31
    visitor.bugs = 0.07865
    visitor.calulated_length = 154.26
    visitor.difficulty = 3.875
    visitor.effort = 914.29
    visitor.h1 = 7
    visitor.h2 = 28
    visitor.length = 46
    visitor.time = 50.79
    visitor.vocabulary = 35
    visitor.volume = 235.95
"""
""" Visit the AST node using the :class:`~radon.visitors.HalsteadVisitor`
    visitor. A namedtuple with the following fields is returned:
        * h1: the number of distinct operators
        * h2: the number of distinct operands
        * N1: the total number of operators
        * N2: the total number of operands
        * h: the vocabulary, i.e. h1 + h2
        * N: the length, i.e. N1 + N2
        * calculated_length: h1 * log2(h1) + h2 * log2(h2)
        * volume: V = N * log2(h)
        * difficulty: D = h1 / 2 * N2 / h2
        * effort: E = D * V
        * time: T = E / 18 seconds
        * bugs: B = V / 3000 - an estimate of the errors in the implementation
"""
