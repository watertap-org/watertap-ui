import sys
import os
import glob

conda_prefix = os.environ['CONDA_PREFIX']

print(f'conda_prefix is {conda_prefix}')

try:
    if sys.platform == "darwin":
        print('darwin')
        entrypoints_src_path = f'{conda_prefix}/lib/python*/site-packages/watertap-*info/entry_points.txt'
        entrypoints_dst_path = f'{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt'
    elif sys.platform == "linux":
        print('linux')
        entrypoints_src_path = f'{conda_prefix}/lib/python*/site-packages/watertap-*info/entry_points.txt'
        entrypoints_dst_path = f'{conda_prefix}/lib/python*/site-packages/setuptools-*info/entry_points.txt'
    else:
        print('windows')
        entrypoints_src_path = f'{conda_prefix}/lib/site-packages/entry_points.txt'
        entrypoints_dst_path = f'{conda_prefix}/lib/site-packages/setuptools-*info/entry_points.txt'
except Exception as e:
    print(f'unable to get entry points src/dst: {e}') 

entrypoints_src = glob.glob(entrypoints_src_path)[0]
entrypoints_dst = glob.glob(entrypoints_dst_path)[0]

print(f'moving entry points from {entrypoints_src} to {entrypoints_dst}')

# get entry points from src
with open(entrypoints_src, 'r') as f:
    dst = open(entrypoints_dst, 'r')
    if not 'watertap.flowsheets' in (dst.read()):
        dst.close()
        entry_points = f.read()
        print(f'found entry points:\n{entry_points}')
        dst = open(entrypoints_dst, 'a')
        dst.write(f'\n{entry_points}')
        dst.close()
    else:
        print(f'file already has watertap entry points, no need to add them')