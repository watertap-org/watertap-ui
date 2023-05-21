from pathlib import Path
from fastapi import HTTPException
import numpy as np
from watertap.tools.parameter_sweep import LinearSample, parameter_sweep
import watertap.examples.flowsheets.case_studies.wastewater_resource_recovery.amo_1575_magprex.magprex as magprex
from importlib import import_module
import idaes.logger as idaeslog

_log = idaeslog.getLogger(__name__)


def set_up_sensitivity(m, solve, output_params):
    outputs = {}
    # optimize_kwargs = {"fail_flag": False}
    optimize_kwargs = {}
    opt_function = solve

    # create outputs
    # we should have the user provide outputs as a parameter
    i = 0
    for each in output_params:
        outputs[f'{i}: {each["name"]}'] = each["param"]
        i += 1

    return outputs, optimize_kwargs, opt_function


def run_analysis(
    m,
    flowsheet,
    parameters,
    output_params,
    results_path="output.csv",
    interpolate_nan_outputs=True,
):
    flowsheet = import_module(flowsheet)
    try:
        solve_function = flowsheet.solve
    except:
        solve_function = flowsheet.optimize
    outputs, optimize_kwargs, opt_function = set_up_sensitivity(
        m, solve_function, output_params
    )

    sweep_params = {}
    # sensitivity analysis
    i = 0
    for each in parameters:
        sweep_params[f'{i}: {each["name"]}'] = LinearSample(
            each["param"], each["lb"], each["ub"], each["nx"]
        )
        i += 1

    global_results = parameter_sweep(
        m,
        sweep_params,
        outputs,
        csv_results_file_name=results_path,
        optimize_function=opt_function,
        optimize_kwargs=optimize_kwargs,
        interpolate_nan_outputs=False,
    )

    return global_results


def run_parameter_sweep(flowsheet, info):
    try:
        _log.info("trying to sweep")
        parameters = []
        output_params = []
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
                    parameters.append(
                        {
                            "name": flowsheet.fs_exp.model_objects[key].name,
                            "lb": flowsheet.fs_exp.model_objects[key].obj.lb,
                            "ub": flowsheet.fs_exp.model_objects[key].obj.ub,
                            "nx": 5,
                            "param": flowsheet.fs_exp.model_objects[key].obj,
                        }
                    )
                    conversion_factors.append(conversion_factor)
                    keys.append(key)
        for key in flowsheet.fs_exp.model_objects:
            if (
                flowsheet.fs_exp.model_objects[key].is_output
                and not flowsheet.fs_exp.model_objects[key].is_input
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
                    # print(f'unable to find conversion factor for {flowsheet.fs_exp.model_objects[key].name}: {e}')
                conversion_factors.append(conversion_factor)
                output_params.append(
                    {
                        "name": flowsheet.fs_exp.model_objects[key].name,
                        "param": flowsheet.fs_exp.model_objects[key].obj,
                    }
                )
                keys.append(key)
        output_path = (
            Path.home() / ".watertap" / "sweep_outputs" / f"{info.name}_sweep.csv"
        )
        results = run_analysis(
            m=flowsheet.fs_exp.m,
            flowsheet=info.module[0:-3],
            parameters=parameters,
            output_params=output_params,
            results_path=output_path,
        )
    except Exception as err:
        _log.error(f"err: {err}")
        raise HTTPException(500, detail=f"Sweep failed: {err}")
    results_table["values"] = results[0].tolist()
    for value in results_table["values"]:
        for i in range(len(value)):
            if np.isnan(value[i]):
                value[i] = None
                # error_params = ""
                # for j in range(len(parameters)):
                #     error_param = parameters[j]["name"]
                #     error_value = value[j]
                #     error_params += f'{error_param}: {error_value}, '
                # error_params = error_params[:-2]
                # _log.error(f'Sweep produced invalid results: {error_params}')
                # raise HTTPException(500, detail=f"Sweep produced invalid results for input parameters: {error_params}")
            else:
                conversion_factor = conversion_factors[i]
                value[i] = value[i] * conversion_factor
    results_table["keys"] = keys
    results_table["num_parameters"] = len(parameters)
    results_table["num_outputs"] = len(output_params)
    return results_table
