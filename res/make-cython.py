#!/usr/bin/python3
# mod : compile cython code
# cre : lwx 20191210
# upd : lwx 20210323
# ver : 1.1

from distutils.core import setup
from Cython.Build import cythonize
import os
import glob

# to compile:
#    python make-cython.py build_ext --inplace
# if error x86_64-linux-gnu-gcc not found:
#    sudo apt install gcc
# if error #include "Python.h":
#    sudo apt install python3-dev

# set the cython files
cythonFiles = [
    "ed.pyx",
    "lib.pyx",
    "config.pyx",
    "db.pyx"
]

setup(
    ext_modules = cythonize(cythonFiles, language_level = "3")
)

# clean up
def delFiles(path, recursive=False):
    files = glob.glob(path, recursive=recursive)
    for f in files:
        print(f)
        try:
            os.remove(f)
        except OSError as e:
            print("Error: %s : %s" % (f, e.strerror))
#delFiles("*.c")
delFiles("build/**/*.o", True)
