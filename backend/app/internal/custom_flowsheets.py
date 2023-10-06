import sys
from idaes.core.util import to_json

def get_flowsheet_variables(m):
    # if i send in m.fs instead of m, i might be able to skip the first 4-5 keys
    fs_components = {}
    failed_variables = []
    failed_categories = []


    print('getting flowsheet variables')
    # flowsheet_dict = to_json(m, fname=None, gz=False, human_read=True, return_dict=True) # flowsheet_dict has keys '__metadata__' and 'unknown'
    # flowsheet_data = flowsheet_dict['unknown']['data'] # flowsheet_dict['unknown'] has keys ['__type__', '__id__', 'active', 'data']
    # # flowsheet_data has key 'None'
    # flowsheet_data = flowsheet_data['None'] # this has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    # flowsheet_components = flowsheet_data['__pyomo_components__'] # this has key 'fs'
    # fs = flowsheet_components['fs'] # this has keys ['__type__', '__id__', 'active', 'data']
    # fs_data = fs['data'] # this has key 'None'
    # fs_data = fs_data['None'] # this has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    # fs_components = fs_data['__pyomo_components__'] # this has keys ['prop', 'feed', 'metab_hydrogen', 'metab_methane', 'product_hydrogen', 'product_methane', 'product_H2O', 's01_expanded', 's02_expanded', 's03_expanded', 's04_expanded', 's05_expanded', 'costing']
    # fs_categories = fs_components.keys()
    # costing = fs_components['costing'] # each category has keys ['__type__', '__id__', 'active', 'data']
    # costing = costing['data'] # now it has key 'None' :/
    # costing = costing['None'] # now it has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    # costing_components = costing['__pyomo_components__'] # this has the costing categories !!


    # simplified:
    flowsheet_dict = to_json(m, fname=None, gz=False, human_read=True, return_dict=True)
    fs_data = flowsheet_dict['unknown']['data']['None']['__pyomo_components__']['fs']['data']['None']['__pyomo_components__']
    fs_categories = fs_data.keys()

    variable_location_prefix = 'm.fs.'
    try:
        for category_key in fs_categories:
        # category_key = 'feed' # this would be a loop through fs_categories

            variable_location_with_category = variable_location_prefix+category_key

            category_components = fs_data[category_key]['data']['None']['__pyomo_components__']
            category_component_keys = fs_data[category_key]['data']['None']['__pyomo_components__'].keys()

            variable_amt = 0
            try:
                for variable_key in category_component_keys:
                    variable_amt+=1
                    print(f'variable #{variable_amt} key is: {variable_key}')
                # variable_key = 'properties' # this would be a loop through category_component_keys

                    variable_location_with_variable_key = variable_location_with_category+f'.{variable_key}'

                    variable = category_components[variable_key] # this guy can have the key 'active'. if so, we have to dive a level deeper
                    try:

                        if 'active' in variable:
                            # print('active is in variable')
                            print(f'variable is {variable}')
                            # we found one with sub categories
                            sub_categories = variable['data']
                            variable_index, _ = list(sub_categories.items())[0]
                            variable_data = sub_categories[variable_index]['__pyomo_components__']

                            if variable_index == 'None':
                                print('variable index is none')
                                variable_location_with_index = variable_location_with_variable_key
                            else:
                                try:
                                    print('trying to convert variable index')
                                    true_variable_index = float(variable_index)
                                except Exception as e:
                                    print('unabel to convert variable index to float. trying eval')
                                    true_variable_index = eval(variable_index)

                                variable_location_with_index = variable_location_with_variable_key+f'[{true_variable_index}]'
                            sub_variable_amt = 0
                            for sub_variable in variable_data:
                                sub_variable_amt+=1
                                print(f'subvariable #{sub_variable_amt} is: {sub_variable}')
                            # sub_variable = 'flow_mass_comp'
                                variable_location_with_sub_variable = variable_location_with_index+f'.{sub_variable}'
                                subvariable_data = variable_data[sub_variable]['data']
                                sub_variable_index, _ = list(subvariable_data.items())[0]
                                leaf_node = subvariable_data[sub_variable_index]
                                variable_location_final = variable_location_with_sub_variable+f'[{sub_variable_index}]'
                                # eval(variable_location_final)
                                print(f'adding to fs components: {variable_location_final}')
                                fs_components[variable_location_final] = leaf_node

                        else:
                            print('active not in variable')
                            print(f'variable is {variable}')
                            variable_data = variable["data"]
                            sub_variable_amt = 0
                            for sub_variable_index in variable_data:
                                sub_variable_amt+=1
                                subvariable_data = variable_data[sub_variable_index]
                                print(f'subvariable #{sub_variable_amt} is: {sub_variable_index}')
                                leaf_node = subvariable_data
                                variable_location_with_index = variable_location_with_variable_key+f'[{sub_variable_index}]'
                                print(f'adding to fs components: {variable_location_with_index}')
                                fs_components[variable_location_with_index] = leaf_node

                    except Exception as e:
                        print(f'failed on variable key {variable_key}: {e}')
                        print(f'variable is {variable}')
                        failed_variables.append(variable_key)
            except Exception as e:
                print(f'failed on category {category_key}: {e}')
                print(f'category_components is {category_components}')
                failed_categories.append(category_key)
                # return fs_components
    except:
        print(f'total failure: {e}')
        return fs_components, failed_categories, failed_variables

            # variable_index, _ = list(variable.items())[0]
            # print(f'variable index is {variable_index}')
            # variable_data = variable[variable_index]['__pyomo_components__']
            # if variable_index is not None:
            #     try:
            #         print('trying to convert variable index')
            #         true_variable_index = float(variable_index)
            #     except Exception as e:
            #         print('unabel to convert variable index to float. trying eval')
            #         true_variable_index = eval(variable_index)
            #     variable_location_with_index = variable_location_with_variable_key+f'[{true_variable_index}]'
            # else:
            #     print('variable index is none')
            #     variable_location_with_index = variable_location_with_variable_key

        # sub_variable_amt = 0
        # for sub_variable in variable_data:
        #     sub_variable_amt+=1
        #     print(f'subvariable #{sub_variable_amt} is: {sub_variable}')
        # # sub_variable = 'flow_mass_comp'
        #     variable_location_with_sub_variable = variable_location_with_index+f'.{sub_variable}'
        #     subvariable_data = variable_data[sub_variable]['data']
        #     sub_variable_index, _ = list(subvariable_data.items())[0]
        #     leaf_node = subvariable_data[sub_variable_index]
        #     variable_location_final = variable_location_with_sub_variable+f'[{sub_variable_index}]'
        #     # eval(variable_location_final)
        #     fs_components[variable_location_final] = leaf_node
    
    
    #variable = category_components[variable_key]['data'] # this contains fixed, value, lb, ub (everything we need?)
    
    # its possible this guy^ is indexed
    # if so, variable_data will have a key (ie 0.0) that is the index. this can be a tuple or a string
    # if NOT, that key will be 'None'
    # variable_index, _ = list(variable.items())[0]
    # variable_data = variable[variable_index]

    # its possible it goes deeper :/
    # for example, if variable key was properties, it goes a level deeper
    # how to handle this?
    # this seems like a common scenario
    # gonna have to check for key values at the variable_key point to see if it contains

    # variable_location = f'm.fs.{category_key}.{variable_key}'
    return fs_components, failed_categories, failed_variables

    # succeeds for 301/349 variables in metab