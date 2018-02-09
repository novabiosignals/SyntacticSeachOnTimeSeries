import numpy as np
import scipy.io.arff.arffread as arf
import matplotlib.pyplot as plt
import regex as re
from SymbolicTranslator import SC

#load data "Exercise1"----------------------------------
eqs = []
data, meta = arf-loadarff('Exercise1/Earthquakes_TRAIN.arff")

#load data to list eqs
for serie in data[0:5]:
    for i in range(0, len(serie)-1):
        eqs.append(serie[i])
#-------------------------------------------------------
#Use the Symbolic Translation tool----------------------
#create SC object
#threshold = 4
s = SC(wordSize=len(eqs), Threshold=True, Alpha=False, threshold=4)

#Quantization process that converts everything superior to threshold to "1":
(s1, s1index) = s.ToPAAThreshold(eqs, mode='sup')

#Quantization for first derivate
(ds1, ds1index) = s.to_PAADerivate(eqs, symbols='-_+')

#Merge strings in matrix
Mat = [s1, ds1]

FinalStr = s.mergeChars(Mat)
print(FinalStr)
#-------------------------------------------------------
#Query 1 - Find all major events------------------------

majorindex = []
major = []
                          
for i in re.finditer(r'(1\+\d-|\d+1-)', FinalStr):
   major.append(eqs[(i.span()[1]-4)//2])
   majorindex.append((i.span()[1]-4)//2)
#-------------------------------------------------------
#Query 2 - Find all positive cases considering that a
#positive case is not preceded by a major event for
#200 samples--------------------------------------------

b = []
c = []

for a in re.finditer(r'(?!(1\+\d-|\d+1-))(?:....){50}?(?=(1\+\d-|\d+1-))', FinalStr):
   print(a.span()[1])
   b.append((a.span()[1] ) // 2)
   c.append(eqs[int((a.span()[1]) // 2)])
#-------------------------------------------------------
#plot everything

plt.plot(eqs)
plt.plot(majorindex, major, 'or')
plt.hlines(y = 4, xmin=0,xmax=len(eqs))
plt.plot(b, c, 'og')
plt.show()




