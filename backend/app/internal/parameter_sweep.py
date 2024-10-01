from pathlib import Path
from fastapi import HTTPException
import numpy as np
from parameter_sweep import (
    ParameterSweep,
    ParameterSweepReader,
)
from importlib import import_module
import idaes.logger as idaeslog
from pyomo.environ import (
    value,
    Var,
    units as pyunits,
)

_log = idaeslog.getLogger(__name__)


def set_up_sensitivity(solve, output_params):
    outputs = {}
    optimize_kwargs = {}
    opt_function = solve

    # create outputs
    # we should have the user provide outputs as a parameter
    i = 0
    for each in output_params:
        outputs[each["name"]] = each["param"]
        i += 1

    return outputs, optimize_kwargs, opt_function


def build_outputs(model, output_keys):
    outputs = {}
    for key, pyo_object in output_keys.items():
        outputs[key] = model.find_component(pyo_object)
    return outputs


def get_conversion_unit(flowsheet, key):
    obj = flowsheet.fs_exp.exports[key].obj
    ui_units = flowsheet.fs_exp.exports[key].ui_units
    temp = Var(initialize=1, units=obj.get_units())
    temp.construct()
    crv = value(pyunits.convert(temp, to_units=ui_units))
    return crv


def run_analysis(
    ui_config,
    flowsheet,
    parameters,
    output_params,
    results_path="output.csv",
    interpolate_nan_outputs=True,
    custom_do_param_sweep_kwargs=None,
    fixed_parameters=None,
    number_of_subprocess=1,
):
    flowsheet_ui = import_module(flowsheet)
    flowsheet = import_module(flowsheet.replace("_ui", ""))

    try:
        solve_function = flowsheet.optimize
    except:
        solve_function = flowsheet.solve
    # TODO: this does not return an actual solve function from the flowsheet...
    # solve_function_action= ui_config.get_action("solve")
    # print(solve_function_action) # This does not return a solve, but a add_action object... not sure why
    outputs, optimize_kwargs, opt_function = set_up_sensitivity(
        solve_function, output_params
    )

    try:
        build_function = flowsheet_ui.build_flowsheet
        build_kwargs = {"build_options": ui_config.fs_exp.build_options}
    except:
        build_function = flowsheet.build
        build_kwargs = {}
    sweep_params = {}
    i = 0
    for each in parameters:
        sweep_params[each["param"]] = {
            "type": "LinearSample",
            "param": each["param"],
            "lower_limit": each["lb"],
            "upper_limit": each["ub"],
            "num_samples": int(each["num_samples"]),
        }
        i += 1
    # generating paramters that are fixed- length 1!
    for f_param in fixed_parameters:
        if f_param["fixed"]:
            sweep_params[f_param["param"] + "_fixed_state"] = {
                "type": "PredeterminedFixedSample",
                "param": f_param["param"],
                "array": np.array([f_param["value"]]),
            }
        else:
            sweep_params[f_param["param"] + "_fixed_state"] = {
                "type": "LinearSample",
                "type": "PredeterminedFixedSample",
                "param": f_param["param"],
                "array": np.array([0]),
                "set_mode": "set_fixed_state",
                "default_value": f_param["value"],
            }
            if f_param["lb"] is not None:
                sweep_params[f_param["param"] + "_lb"] = {
                    "type": "PredeterminedFixedSample",
                    "param": f_param["param"],
                    "array": np.array([f_param["lb"]]),
                    "set_mode": "set_lb",
                }
            if f_param["ub"] is not None:
                sweep_params[f_param["param"] + "_ub"] = {
                    "type": "PredeterminedFixedSample",
                    "param": f_param["param"],
                    "array": np.array([f_param["ub"]]),
                    "set_mode": "set_ub",
                }
    # Check if user provided custom kwargs, if not don't use cutm swep param
    # else check if user provided custom sweep function, if not use watertap default (will be merged)
    if custom_do_param_sweep_kwargs is None:
        custom_do_param_sweep = None
    else:
        custom_do_param_sweep = custom_do_param_sweep_kwargs.get(
            "custom_do_param_sweep"
        )
        if custom_do_param_sweep is None:
            custom_do_param_sweep_kwargs = None
    ps = ParameterSweep(
        csv_results_file_name=results_path,
        optimize_function=solve_function,
        interpolate_nan_outputs=False,
        custom_do_param_sweep=custom_do_param_sweep,
        custom_do_param_sweep_kwargs=custom_do_param_sweep_kwargs,
        reinitialize_before_sweep=False,
        parallel_back_end="MultiProcessing",
        number_of_subprocesses=number_of_subprocess,
    )
    print("number_of_subprocess ", number_of_subprocess)
    global_results = ps.parameter_sweep(
        build_model=build_function,
        build_sweep_params=ParameterSweepReader()._dict_to_params,
        build_sweep_params_kwargs={"input_dict": sweep_params},
        build_model_kwargs=build_kwargs,
        build_outputs=build_outputs,
        build_outputs_kwargs={"output_keys": outputs},
    )

    return global_results


def run_parameter_sweep(flowsheet, info, number_of_subprocess):
    # try:
    _log.info("trying to sweep")
    parameters = []
    # for keeping track of user defined paramters in flowsheet that are changed
    fixed_parameters = []
    fixed_parameters_keys = []
    output_params = []
    # for keeping track of key to export, will be a list in same order a keys, and conversion factors
    # but defines sweep_params and outputs.
    export_keys = []
    keys = []
    conversion_factors = {}
    results_table = {"headers": []}
    for key in flowsheet.fs_exp.exports:
        if flowsheet.fs_exp.exports[key].is_sweep:
            if (
                flowsheet.fs_exp.exports[key].lb is not None
                and flowsheet.fs_exp.exports[key].ub is not None
            ):
                results_table["headers"].append(flowsheet.fs_exp.exports[key].name)
                conversion_factor = get_conversion_unit(flowsheet, key)
                try:
                    parameters.append(
                        {
                            "name": flowsheet.fs_exp.exports[key].name,
                            "lb": flowsheet.fs_exp.exports[key].obj.lb,
                            "ub": flowsheet.fs_exp.exports[key].obj.ub,
                            "num_samples": flowsheet.fs_exp.exports[key].num_samples,
                            "param": flowsheet.fs_exp.exports[key].obj.name,
                        }
                    )
                except:
                    parameters.append(
                        {
                            "name": flowsheet.fs_exp.exports[key].name,
                            "lb": flowsheet.fs_exp.exports[key].obj.lb,
                            "ub": flowsheet.fs_exp.exports[key].obj.ub,
                            "num_samples": "5",
                            "param": flowsheet.fs_exp.exports[key].obj.name,
                        }
                    )
                export_keys.append(
                    ["sweep_params", flowsheet.fs_exp.exports[key].obj.name]
                )
                flowsheet.fs_exp.exports[key].obj.fix()
                conversion_factors[key] = conversion_factor
                keys.append(key)
        elif flowsheet.fs_exp.exports[key].is_input:
            fixed_parameters.append(
                {
                    "name": flowsheet.fs_exp.exports[key].obj.name,
                    "value": flowsheet.fs_exp.exports[key].obj.value,
                    "num_samples": "1",
                    "param": flowsheet.fs_exp.exports[key].obj.name,
                    "fixed": flowsheet.fs_exp.exports[key].fixed,
                    "lb": flowsheet.fs_exp.exports[key].obj.lb,
                    "ub": flowsheet.fs_exp.exports[key].obj.ub,
                }
            )
            fixed_parameters_keys.append(flowsheet.fs_exp.exports[key].name)
    for key in flowsheet.fs_exp.exports:
        if (
            flowsheet.fs_exp.exports[key].is_output
            or (
                not flowsheet.fs_exp.exports[key].is_output
                and flowsheet.fs_exp.exports[key].is_input
                and not flowsheet.fs_exp.exports[key].fixed
            )
            # and not flowsheet.fs_exp.exports[key].is_input
        ):
            results_table["headers"].append(flowsheet.fs_exp.exports[key].name)

            try:
                conversion_factor = get_conversion_unit(flowsheet, key)
            except Exception as e:
                conversion_factor = 1
            conversion_factors[key] = conversion_factor
            # we will use obj names through out
            output_params.append(
                {
                    "name": flowsheet.fs_exp.exports[key].obj.name,
                    "param": flowsheet.fs_exp.exports[key].obj.name,
                }
            )
            export_keys.append(["outputs", flowsheet.fs_exp.exports[key].obj.name])
            keys.append(key)
    output_path = Path.home() / ".nawi" / "sweep_outputs" / f"{info.name}_sweep.csv"
    results_arr, output_dict = run_analysis(
        ui_config=flowsheet,
        flowsheet=info.module,
        parameters=parameters,
        output_params=output_params,
        results_path=output_path,
        fixed_parameters=fixed_parameters,
        number_of_subprocess=number_of_subprocess,
    )
    # except Exception as err:
    #     _log.error(f"err: {err}")
    #     raise HTTPException(500, detail=f"Sweep failed: {err}")
    # we can't rely on result_arr order, as it will be async and out of order,
    # so instead here, we will rebuild expected order from out output_dict
    num_samples = output_dict[export_keys[0][0]][export_keys[0][1]]["value"].size
    result_arr = []
    for ns in range(num_samples):
        result_arr.append([])
        for i, (result_type, key) in enumerate(export_keys):
            value = output_dict[export_keys[i][0]][export_keys[i][1]]["value"][ns]

            if np.isnan(value) or output_dict["solve_successful"][ns] == False:
                value = None
            else:
                conversion_factor = conversion_factors[key]
                value = value * conversion_factor
            result_arr[-1].append(value)
    results_table["values"] = result_arr
    results_table["keys"] = keys
    results_table["num_parameters"] = len(parameters)
    results_table["num_outputs"] = len(output_params)
    return results_table
