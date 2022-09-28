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

# pyomo_file_tree = {
#         "include": {
#             "asl": [
#                 'asl_pfgh.h', 'jacpdim.h', 'opcode.hd', 'jac2dim.h', 'obj_adj.h', 'r_opn.hd', 'getstub.h', 'errchk.h', 'arith.h', 'nlp.h', 'stdio1.h', 'nlp2.h', 'asl.h', 'psinfo.h', 'funcadd.h', 'asl_pfg.h', 'avltree.h'
#             ],
#             "asl2": [
#                 'asl_pfgh.h', 'jacpdim.h', 'opcode.hd', 'jac2dim.h', 'obj_adj.h', 'r_opn.hd', 'opno2.h', 'getstub.h', 'errchk.h', 'arith.h', 'nlp.h', 'stdio1.h', 'nlp2.h', 'asl.h', 'psinfo.h', 'funcadd.h', 'asl_pfg.h', 'avltree.h'
#             ]
#         },
#         "lib": ['libpynumero_ASL.dylib', 'libasl.a', 'libasl2.a'],
#         "share": {
#             "ampl-asl": ['ampl-asl-config.cmake', 'ampl-asl-config-noconfig.cmake']
#         }
#     }

# idaes_file_tree = {
#     "bin": [
#         'ipopt_sens', 'cubic_roots.so', 'libstdc++.6.dylib', 'version_lib.txt', 
#         'libsipopt.dylib', 'libipopt.3.dylib', 'ipopt', 'couenne', 'libipopt.dylib', 
#         'cbc', 'libgfortran.5.dylib', 'libpynumero_ASL.dylib', 'functions.so', 
#         'iapws95_external.so', 'license_lib.txt', 'k_aug', 'version_solvers.txt', 
#         'ipopt_l1', 'bonmin', 'swco2_external.so', 'libsipopt.3.dylib', 'license.txt', 
#         'ipopt_sens_l1', 'libgcc_s.1.1.dylib', 'clp', 'libgomp.1.dylib', 'dot_sens'
#         ]
# }

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
# pyomo_files = extract_file_names(pyomo_file_tree, "extensions/.pyomo/")
# print(os.listdir('../extensions/.idaes/bin'))
idaes_files = extract_file_names(idaes_file_tree, "extensions/.idaes/")
if sys.platform == "darwin":
    datas=[]
    # for each in pyomo_files:
    #     each_one = each.replace('//','/')
    #     dst_arr = each_one.split('/')[0:-1]
    #     dst = ""
    #     for dir in dst_arr:
    #         dst += f'{dir}/'
    #     datas.append((f'{each_one}', f'{dst}'))
    for each in idaes_files:
        each_one = each.replace('//','/')
        dst_arr = each_one.split('/')[0:-1]
        dst = ""
        for dir in dst_arr:
            dst += f'{dir}/'
        datas.append((f'{each_one}', f'{dst}'))

    print(datas)