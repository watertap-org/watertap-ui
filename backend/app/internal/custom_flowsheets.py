import sys
from idaes.core.util import to_json

def get_flowsheet_variables(m):
    # if i send in m.fs instead of m, i might be able to skip the first 4-5 keys
    print('getting flowsheet variables')
    flowsheet_dict = to_json(m, fname=None, gz=False, human_read=True, return_dict=True) # flowsheet_dict has keys '__metadata__' and 'unknown'
    flowsheet_data = flowsheet_dict['unknown']['data'] # flowsheet_dict['unknown'] has keys ['__type__', '__id__', 'active', 'data']
    # flowsheet_data has key 'None'
    flowsheet_data = flowsheet_data['None'] # this has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    flowsheet_components = flowsheet_data['__pyomo_components__'] # this has key 'fs'
    fs = flowsheet_components['fs'] # this has keys ['__type__', '__id__', 'active', 'data']
    fs_data = fs['data'] # this has key 'None'
    fs_data = fs_data['None'] # this has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    fs_components = fs_data['__pyomo_components__'] # this has keys ['prop', 'feed', 'metab_hydrogen', 'metab_methane', 'product_hydrogen', 'product_methane', 'product_H2O', 's01_expanded', 's02_expanded', 's03_expanded', 's04_expanded', 's05_expanded', 'costing']
    fs_categories = fs_components.keys()
    costing = fs_components['costing'] # each category has keys ['__type__', '__id__', 'active', 'data']
    costing = costing['data'] # now it has key 'None' :/
    costing = costing['None'] # now it has keys ['__type__', '__id__', 'active', '__pyomo_components__']
    costing_components = costing['__pyomo_components__'] # this has the costing categories !!


    # simplified:
    flowsheet_dict = to_json(m, fname=None, gz=False, human_read=True, return_dict=True)
    fs_data = flowsheet_dict['unknown']['data']['None']['__pyomo_components__']['fs']['data']['None']['__pyomo_components__']
    fs_categories = fs_data.keys()
    category_key = 'feed' # this would be a loop through fs_categories
    category_components = fs_data[category_key]['data']['None']['__pyomo_components__']
    category_component_keys = fs_data[category_key]['data']['None']['__pyomo_components__'].keys()
    variable_key = 'flow_vol' # this would be a loop through category_component_keys

    category_components[variable_key] # this guy can have the key 'active'. if so, we have to dive a level deeper

    variable = category_components[variable_key]['data'] # this contains fixed, value, lb, ub (everything we need?)
    # its possible this guy^ is indexed
    # if so, variable_data will have a key (ie 0.0) that is the index. this can be a tuple or a string
    # if NOT, that key will be 'None'
    variable_index, _ = list(variable.items())[0]
    variable_data = variable[variable_index]

    # its possible it goes deeper :/
    # for example, if variable key was properties, it goes a level deeper
    # how to handle this?
    # this seems like a common scenario
    # gonna have to check for key values at the variable_key point to see if it contains

    # variable_location = f'm.fs.{category_key}.{variable_key}'
    return fs_components