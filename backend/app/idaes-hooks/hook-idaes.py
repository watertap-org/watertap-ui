import sys
import os

def extract_file_names(files, prefix):
    ret = []
    for each in files:
        if isinstance(files[each], dict):
            ret+=extract_file_names(files[each], prefix+each)
        else:
            for each_one in files[each]:
                if len(prefix)>0:
                    ret.append(f'{prefix}/{each}/{each_one}')
                else:
                    ret.append(f'{each}/{each_one}')
    return ret

idaes_file_tree = {
    "bin": [
        'ipopt_sens', 'cubic_roots.so', 'libstdc++.6.dylib', 'version_lib.txt', 
        'libsipopt.dylib', 'libadolc.2.dylib', 'general_helmholtz_external.so', 
        'libadolc.dylib', 'libipopt.3.dylib', 'libadolc.la', 'ipopt', 'couenne', 
        'libipopt.dylib', 'cbc', 'libgfortran.5.dylib', 'libpynumero_ASL.dylib', 
        'functions.so', 'iapws95_external.so', 'license_lib.txt', 'k_aug', 
        'version_solvers.txt', 'ipopt_l1', 'bonmin', 'swco2_external.so', 
        'libsipopt.3.dylib', 'license.txt', 'ipopt_sens_l1', 'libgcc_s.1.1.dylib', 
        'clp', 'libgomp.1.dylib', 'dot_sens']
}
idaes_files = extract_file_names(idaes_file_tree, "extensions/.idaes/")
if sys.platform == "darwin":
    datas=[]
    for each in idaes_files:
        each_one = each.replace('//','/')
        dst_arr = each_one.split('/')[0:-1]
        dst = ""
        for dir in dst_arr:
            dst += f'{dir}/'
        datas.append((f'{each_one}', f'{dst}'))

    print(datas)
    