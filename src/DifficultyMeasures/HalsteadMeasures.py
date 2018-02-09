import numpy as np
import regex as rx
import textwrap
import inspect
import pytest

from radon.visitors import HalsteadVisitor
from radon.metrics import h_visit

def OprtOprd(regX):

	#look for operators except the "+" operator
	oprtA = rx.findall(r'\?<=|\?=|\?!=|\?!<|\*\?|\*|\?]', regX)
	#look for the string '+'
	oprdP = rx.findall(r'\\\+', regX)
	#look for the operator '+' and '+?'
	oprtP = rx.findall(r'\+\?|\+', regX)
	#look for operands
	oprdA = rx.findall(r'[\d \w \s \. -]', regX)

	#total number of operators
	Toprt = len(oprtA) + len(oprtP) - len(oprdP)
	#total number of operands
	Toprd = len(oprdA) + len(oprdP)
	#number of different operators
	oprt = len(np.unique(oprtA)) if(len(oprtP) - len(oprdP) == 0) else len(np.unique(oprtA)) + 1
	#number of different operands
	oprd = len(np.unique(oprdA)) if(len(oprdP) == 0) else len(np.unique(oprdA)) + 1

	return Toprt, Toprd, oprt, oprd

def Vocabulary(oprt, oprd):
	return oprt + oprd

def Length(Toprt, Toprd):
	return Toprd+Toprt

def EntropyLength(oprt, oprd):
	if(oprt == 0 and oprd > 0):
		return oprd*np.log2(oprd)
	elif(oprt > 0 and oprd == 0):
		return oprt*np.log2(oprt)
	else:
		return oprt*np.log2(oprt) + oprd*np.log2(oprd)

def Volume(Lgth, Vocab):
	return Lgth*np.log2(Vocab)

def Difficulty(oprt, oprd, Toprd):
	return (oprt / 2) + (Toprd / oprd)

def Effort(Vol, Dif):
	return Vol*Dif

def ConnotationDifficulty(cnnt):
	TOperators = []
	TOperands = []
	sc_str = cnnt.encode("unicode_escape").decode("utf-8")
	print(sc_str)
	sc_func_stack = sc_str.split(r'\u')
	print(sc_func_stack)
	for s in sc_func_stack[1:]:
		print(s)
		b = s.split(' ')
		print(b)
		print(np.size(b))
		TOperators.append(b[0])
		if(np.size(b)>2):
			TOperands.append(b[1:])
		else:
			TOperands.append(b[1])

# 	print(TOperators)
# 	print(TOperands)

	return TOperators, TOperands

def HalsteadSyntatic(cfg):
	regX = cfg["expression"]
	cnnt = cfg["connotation"]

	#connotation Difficulty:
	TCOprt, TCOprd = ConnotationDifficulty(cnnt)
	#regex difficulty
	Toprt, Toprd, oprt, oprd = OprtOprd(regX)
	#sum operators and operands from both steps
	Toprt += len(TCOprt)
	Toprd += len(TCOprd)
	oprt += len(np.unique(TCOprt))
	oprd += len(np.unique(TCOprd))
	
	voc = Vocabulary(oprt, oprd)
	lgt = Length(Toprt, Toprd)
	entropy = EntropyLength(oprt, oprd)
	vol = Volume(lgt, voc)
	dif = Difficulty(oprt, oprd, Toprd)
	eff = Effort(vol, dif)

	return Toprt, Toprd, oprt, oprd, voc, lgt, entropy, vol, dif, eff

def HalsteadClassical(code, pythonFile):
	"""
	Accepts the code in comments and the pythonFile that runs the corresponding code to search for all operators.
	The first stage, will use the radon.visitor command to find all methods that correspond as operators in the python
	module.
	The second phase will search for operators and operands as functions, in which the function name is a operators and
	its arguments are operands. It searches for functions inside functions. 
	Note that some functions might not be found if the code uses some previous simplification of the module, like:
	import numpy as np:
	np.percentile --> might not be defined as function
	from numpy import percentile:
	percentile --> will be set as function for sure
	"""
	"""
		* h1: the number of distinct operators
		* h2: the number of distinct operands
		* N1: the total number of operators
		* N2: the total number of operands
	"""
	#For typical operators in the script
	dedent = lambda code: textwrap.dedent(code).strip()
	visitor = h_visit(dedent(code))

	oprt = visitor[0]
	oprd = visitor[1]
	Toprt = visitor[2]
	Toprd = visitor[3]

	TMoperators = []
	TMoperands = []

	#Find all function candidates
	functions = rx.findall(r'(\w+)\(', code)

	#Find the true functions and arguments
	for name, data in inspect.getmembers(pythonFile, inspect.isfunction):
		if (name in functions):
			TMoperators.append(name)
			# search for all arguments of the named function:
			print('%s :' % name)
			a = rx.findall(name + r'\(.*?\)', code)
			#look for specific arguments
			for s in a:
				#Find arguments that comes after a comma, inclusive if misinterpretate an argument with a 
				# interval: peaks(a, b, c[0, 10]) --> ['b' , 'c[0', '10]']
				b = rx.findall(r', (.*?[\[\]\)])', s)
				# finds all first arguments: peaks(a, b, c[0, 10]) --> ['a']
				c = rx.findall(name + r'\((.*?)[,\)\[]', s)
				TMoperands += c
				#searches in b which are the correct arguments:
				if b:
					for ss in b:
						print(ss)
						#['b' , 'c[0', '10]']
						if ']' not in ss:
							ss = rx.findall(r'(.*?)[\[\)]', ss)
							TMoperands += ss #['b' , 'c[0', '10]'] --> ['b', 'c']

	Moperands = np.unique(TMoperands)
	Moperators = np.unique(TMoperators)

	print("Total Operands: ")
	print(TMoperands)
	print("Total Operators: ")
	print(TMoperators)
	print("unique operands: ")
	print(Moperands)
	print("unique operators: ")
	print(Moperators)

	oprt += np.size(Moperators)
	oprd += np.size(Moperands)
	Toprt += np.size(TMoperators)
	Toprd += np.size(TMoperands)

	voc = Vocabulary(oprt, oprd)
	lgt = Length(Toprt, Toprd)
	entropy = EntropyLength(oprt, oprd)
	vol = Volume(lgt, voc)
	dif = Difficulty(oprt, oprd, Toprd)
	eff = Effort(vol, dif)

	return oprt, oprd, Toprt, Toprd, voc, lgt, entropy, vol, dif, eff
