from RegexHalstead import *

print(HalsteadRegex('(1\+).+?(1-).+?(0[\+_-]).+?(0-).+?'))

#list of operators: +?
#list of operands: 1, \+, -, ., 0, _

"""
total operators = 4
total operands = 14
different operators = 1
different operands = 6
vocabulary = 7
length = 18
calculatedLength = 15.509775004326936
volume = 50.532388597036878
Difficulty = 2.8333333333333335
Effort = 143.17510102493782
"""
