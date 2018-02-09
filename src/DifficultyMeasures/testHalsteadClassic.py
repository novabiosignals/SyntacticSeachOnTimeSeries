from HalsteadMeasures import HalsteadClassical
#Should import the correct python file where the StepDetection exercise is solved.
#import StepDetectionClassical

code = """pks = peakdelta(s, delta=np.percentile(s, 70) - np.percentile(s, 30))
stepsl = []
stepsr = []
medsteps = np.median(pks[1][:, 1])
for (i, p) in zip(pks[1][:, 0], pks[1][:, 1]):
    if p <= medsteps:
        stepsl += [[i, p]]
    else:
        stepsr += [[i, p]]

stepsl = np.array(stepsl)
stepsr = np.array(stepsr)"""

print(HalsteadClassical(code, StepDetectionClassical))
