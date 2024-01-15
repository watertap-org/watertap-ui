from pathlib import Path
from fastapi import HTTPException
import numpy as np
from watertap.tools.parameter_sweep import LinearSample, ParameterSweep, parameter_sweep
import watertap.examples.flowsheets.case_studies.wastewater_resource_recovery.amo_1575_magprex.magprex as magprex
from watertap.tools.parameter_sweep import ParameterSweepReader

from importlib import import_module
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)


def set_up_sensitivity(solve, output_params):
    outputs = {}
    # optimize_kwargs = {"fail_flag": False}
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


def run_analysis(
    ui_config,
    flowsheet,
    parameters,
    output_params,
    results_path="output.csv",
    interpolate_nan_outputs=True,
    custom_do_param_sweep_kwargs=None,
    fixed_parameters=None,
):
    flowsheet_ui = import_module(flowsheet)
    flowsheet = import_module(flowsheet.replace("_ui", ""))

    try:
        solve_function = flowsheet.optimize
    except:
        solve_function = flowsheet.solve

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
    # sensitivity analysis
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
                "type": "LinearSample",
                "param": f_param["param"],
                "lower_limit": f_param["value"],
                "upper_limit": f_param["value"],
                "num_samples": 1,
            }
        else:
            sweep_params[f_param["param"] + "_fixed_state"] = {
                "type": "LinearSample",
                "param": f_param["param"],
                "lower_limit": 0,
                "upper_limit": 0,
                "num_samples": 1,
                "set_mode": "set_fixed_state",
                "default_value": f_param["value"],
            }
            if f_param["lb"] is not None:
                sweep_params[f_param["param"] + "_lb"] = {
                    "type": "LinearSample",
                    "param": f_param["param"],
                    "lower_limit": f_param["lb"],
                    "upper_limit": f_param["lb"],
                    "num_samples": 1,
                    "set_mode": "set_lb",
                }
            if f_param["ub"] is not None:
                sweep_params[f_param["param"] + "_ub"] = {
                    "type": "LinearSample",
                    "param": f_param["param"],
                    "lower_limit": f_param["ub"],
                    "upper_limit": f_param["ub"],
                    "num_samples": 1,
                    "set_mode": "set_ub",
                }
    print("sweep_params", sweep_params)
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
    print(fixed_parameters)
    ps = ParameterSweep(
        csv_results_file_name=results_path,
        optimize_function=solve_function,
        # optimize_kwargs=optimize_kwargs,
        interpolate_nan_outputs=False,
        custom_do_param_sweep=custom_do_param_sweep,
        custom_do_param_sweep_kwargs=custom_do_param_sweep_kwargs,
        reinitialize_before_sweep=False,
        parallel_back_end="MultiProcessing",
        number_of_subprocesses=10,
    )
    global_results = ps.parameter_sweep(
        build_model=build_function,
        build_sweep_params=ParameterSweepReader()._dict_to_params,
        build_sweep_params_kwargs={"input_dict": sweep_params},
        build_model_kwargs=build_kwargs,
        build_outputs=build_outputs,
        build_outputs_kwargs={"output_keys": outputs},
    )

    return global_results


def run_parameter_sweep(flowsheet, info):
    try:
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
        conversion_factors = []
        results_table = {"headers": []}
        for key in flowsheet.fs_exp.model_objects:
            if flowsheet.fs_exp.model_objects[key].is_sweep:
                if (
                    flowsheet.fs_exp.model_objects[key].lb is not None
                    and flowsheet.fs_exp.model_objects[key].ub is not None
                ):
                    results_table["headers"].append(
                        flowsheet.fs_exp.model_objects[key].name
                    )
                    conversion_factor = (
                        flowsheet.fs_exp.model_objects[key].ub
                        / flowsheet.fs_exp.model_objects[key].obj.ub
                    )
                    try:
                        parameters.append(
                            {
                                "name": flowsheet.fs_exp.model_objects[key].obj.name,
                                "lb": flowsheet.fs_exp.model_objects[key].obj.lb,
                                "ub": flowsheet.fs_exp.model_objects[key].obj.ub,
                                "num_samples": flowsheet.fs_exp.model_objects[
                                    key
                                ].num_samples,
                                "param": flowsheet.fs_exp.model_objects[key].obj.name,
                            }
                        )
                    except:
                        parameters.append(
                            {
                                "name": flowsheet.fs_exp.model_objects[key].obj.name,
                                "lb": flowsheet.fs_exp.model_objects[key].obj.lb,
                                "ub": flowsheet.fs_exp.model_objects[key].obj.ub,
                                "num_samples": "5",
                                "param": flowsheet.fs_exp.model_objects[key].obj.name,
                            }
                        )
                    export_keys.append(
                        ["sweep_params", flowsheet.fs_exp.model_objects[key].obj.name]
                    )
                    # HTTPException(500, detail=f"Sweep failed: {parameters}")
                    flowsheet.fs_exp.model_objects[key].obj.fix()
                    conversion_factors.append(conversion_factor)
                    keys.append(key)
            elif flowsheet.fs_exp.model_objects[key].is_input:
                fixed_parameters.append(
                    {
                        "name": flowsheet.fs_exp.model_objects[key].obj.name,
                        "value": flowsheet.fs_exp.model_objects[key].obj.value,
                        "num_samples": "1",
                        "param": flowsheet.fs_exp.model_objects[key].obj.name,
                        "fixed": flowsheet.fs_exp.model_objects[key].fixed,
                        "lb": flowsheet.fs_exp.model_objects[key].obj.lb,
                        "ub": flowsheet.fs_exp.model_objects[key].obj.ub,
                    }
                )
                fixed_parameters_keys.append(flowsheet.fs_exp.model_objects[key].name)
        for key in flowsheet.fs_exp.model_objects:
            if (
                flowsheet.fs_exp.model_objects[key].is_output
                # and not flowsheet.fs_exp.model_objects[key].is_input
            ):
                results_table["headers"].append(
                    flowsheet.fs_exp.model_objects[key].name
                )
                try:
                    conversion_factor = (
                        flowsheet.fs_exp.model_objects[key].value
                        / flowsheet.fs_exp.model_objects[key].obj.value
                    )
                except Exception as e:
                    conversion_factor = 1
                conversion_factors.append(conversion_factor)
                output_params.append(
                    {
                        "name": flowsheet.fs_exp.model_objects[key].obj.name,
                        "param": flowsheet.fs_exp.model_objects[key].obj.name,
                    }
                )
                export_keys.append(
                    ["outputs", flowsheet.fs_exp.model_objects[key].obj.name]
                )
                keys.append(key)
        output_path = (
            Path.home() / ".watertap" / "sweep_outputs" / f"{info.name}_sweep.csv"
        )
        results_arr, output_dict = run_analysis(
            ui_config=flowsheet,
            flowsheet=info.module,
            # # flowsheet=info.module[0:-3], # replace _ui instead?
            # flowsheet=info.module.replace("_ui", ""),
            parameters=parameters,
            output_params=output_params,
            results_path=output_path,
            fixed_parameters=fixed_parameters,
            # custom_do_param_sweep_kwargs=flowsheet.custom_do_param_sweep_kwargs,
        )
        # print(results)
    except Exception as err:
        _log.error(f"err: {err}")
        raise HTTPException(500, detail=f"Sweep failed: {err}")
    num_samples = output_dict[export_keys[0][0]][export_keys[0][1]]["value"].size
    result_arr = []
    for ns in range(num_samples):
        result_arr.append([])
        for i, (result_type, key) in enumerate(export_keys):
            value = output_dict[export_keys[i][0]][export_keys[i][1]]["value"][ns]

            if np.isnan(value) or output_dict["solve_successful"][ns] == False:
                value = None
            else:
                conversion_factor = conversion_factors[i]
                value = value * conversion_factor
            result_arr[-1].append(value)
    results_table["values"] = result_arr
    results_table["keys"] = keys
    results_table["num_parameters"] = len(parameters)
    results_table["num_outputs"] = len(output_params)
    print(results_table)
    return results_table
