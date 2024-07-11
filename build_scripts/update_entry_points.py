import sys
import os
import glob
import watertap
import re

from pathlib import Path


conda_prefix = os.environ["CONDA_PREFIX"]

print(f"conda_prefix is {conda_prefix}")

""" specify water tap path with setup.py file that contains entry points"""
watertap_path = r"D:\OneDrive\NAWI_work\Analysis\WaterTAP\watertap-dev\setup.py"
# try to automaticly get watertap path if user does not provide one
if watertap_path == None:
    watertap_path = Path(watertap.__path__[0])
    print(watertap_path)
    watertap_path = os.path.join(watertap_path, "setup.py")

print(f"watertap path is: {watertap_path}")
entry_points = []
start_getting_entryies = False
with open(watertap_path, "r") as f:
    for i in f:
        if "watertap.flowsheets" in i:
            start_getting_entryies = True
        elif start_getting_entryies == True and "]" == i:
            break
        elif start_getting_entryies:
            entry = re.search('"[^"]+', i)
            if entry is not None:
                entry_points.append(entry.group(0)[1:])
                print(f"found entry point: {entry.group(0)}")

try:
    if sys.platform == "darwin":
        print("darwin")
        entrypoints_src_path = (
            f"{conda_prefix}/lib/python*/site-packages/watertap-*info/entry_points.txt"
        )
        entrypoints_dst_path = f"{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt"
    elif sys.platform == "linux":
        print("linux")
        entrypoints_src_path = (
            f"{conda_prefix}/lib/python*/site-packages/watertap-*info/entry_points.txt"
        )
        entrypoints_dst_path = f"{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt"
    else:
        # print("windows")
        entrypoints_src_path = (
            f"{conda_prefix}/lib/site-packages/watertap-*info/entry_points.txt"
        )
        entrypoints_dst_path = (
            f"{conda_prefix}/lib/site-packages/setuptools-*info/entry_points.txt"
        )
except Exception as e:
    print(f"unable to get entry points src/dst: {e}")

print(f"globbing from {entrypoints_src_path} to {entrypoints_dst_path}")

entrypoints_src = glob.glob(entrypoints_src_path)[0]
entrypoints_dst = glob.glob(entrypoints_dst_path)[0]
# get entry points from src
for entry_point in [entrypoints_src, entrypoints_dst]:
    cur_file = []
    with open(entry_point, "r", newline="") as f:
        non_watertap_entry = True
        k = 0
        for i in f:
            if "[watertap.flowsheets]" in i:
                non_watertap_entry = False
            elif non_watertap_entry == False and len(i) == 1:
                non_watertap_entry = True
            if non_watertap_entry:
                cur_file.append(i)
                # print(k, non_watertap_entry, i, len(i))
            k += 1
    with open(entry_point, "w", newline="") as f:
        for l in cur_file:
            f.write(f"{l}")
        f.write(f"[watertap.flowsheets]\n")
        for ep in entry_points:
            print("writing entery point", ep)
            f.write(f"{ep}\n")
