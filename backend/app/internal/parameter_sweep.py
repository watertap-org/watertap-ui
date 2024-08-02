from pathlib import Path
from fastapi import HTTPException
import numpy as np
from parameter_sweep import LinearSample, ParameterSweep, parameter_sweep
from importlib import import_module
import idaes.logger as idaeslog
from pyomo.environ import (
    ConcreteModel,
    value,
    Var,
    units as pyunits,
)

_log = idaeslog.getLogger(__name__)


def set_up_sensitivity(m, solve, output_params):
    outputs = {}
    optimize_kwargs = {}
    opt_function = solve

    # create outputs
    # we should have the user provide outputs as a parameter
    i = 0
    for each in output_params:
        outputs[f'{i}: {each["name"]}'] = each["param"]
        i += 1

    return outputs, optimize_kwargs, opt_function


def get_conversion_unit(flowsheet, key):
    obj = flowsheet.fs_exp.exports[key].obj
    ui_units = flowsheet.fs_exp.exports[key].ui_units
    temp = Var(initialize=1, units=obj.get_units())
    temp.construct()
    crv = value(pyunits.convert(temp, to_units=ui_units))
    return crv


def run_analysis(
    flowsheet,
    parameters,
    output_params,
    results_path="output.csv",
    interpolate_nan_outputs=True,
    custom_do_param_sweep_kwargs=None,
):
    m = flowsheet.fs_exp.m
    solve_function = flowsheet.get_action("solve")
    outputs, optimize_kwargs, opt_function = set_up_sensitivity(
        m, solve_function, output_params
    )

    sweep_params = {}
    # sensitivity analysis
    i = 0
    for each in parameters:
        sweep_params[f'{i}: {each["name"]}'] = LinearSample(
            each["param"], each["lb"], each["ub"], int(each["num_samples"])
        )
        i += 1
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
        optimize_function=opt_function,
        optimize_kwargs=optimize_kwargs,
        interpolate_nan_outputs=False,
        custom_do_param_sweep=custom_do_param_sweep,
        custom_do_param_sweep_kwargs=custom_do_param_sweep_kwargs,
        reinitialize_before_sweep=False,
    )
    global_results = ps.parameter_sweep(
        m,
        sweep_params,
        outputs,
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
        for key in flowsheet.fs_exp.exports:
            if flowsheet.fs_exp.exports[key].is_sweep:
                if (
                    flowsheet.fs_exp.exports[key].lb is not None
                    and flowsheet.fs_exp.exports[key].ub is not None
                ):
                    results_table["headers"].append(
                        flowsheet.fs_exp.exports[key].name
                    )
                    conversion_factor = get_conversion_unit(flowsheet, key)
                    try:
                        parameters.append(
                            {
                                "name": flowsheet.fs_exp.exports[key].name,
                                "lb": flowsheet.fs_exp.exports[key].obj.lb,
                                "ub": flowsheet.fs_exp.exports[key].obj.ub,
                                "num_samples": flowsheet.fs_exp.exports[
                                    key
                                ].num_samples,
                                "param": flowsheet.fs_exp.exports[key].obj,
                            }
                        )
                    except:
                        parameters.append(
                            {
                                "name": flowsheet.fs_exp.exports[key].name,
                                "lb": flowsheet.fs_exp.exports[key].obj.lb,
                                "ub": flowsheet.fs_exp.exports[key].obj.ub,
                                "num_samples": "5",
                                "param": flowsheet.fs_exp.exports[key].obj,
                            }
                        )
                    # HTTPException(500, detail=f"Sweep failed: {parameters}")
                    flowsheet.fs_exp.exports[key].obj.fix()
                    conversion_factors.append(conversion_factor)
                    keys.append(key)
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
                results_table["headers"].append(
                    flowsheet.fs_exp.exports[key].name
                )

                try:
                    conversion_factor = get_conversion_unit(flowsheet, key)
                except Exception as e:
                    conversion_factor = 1
                conversion_factors.append(conversion_factor)
                output_params.append(
                    {
                        "name": flowsheet.fs_exp.exports[key].name,
                        "param": flowsheet.fs_exp.exports[key].obj,
                    }
                )
                keys.append(key)
        output_path = (
            Path.home() / ".nawi" / "sweep_outputs" / f"{info.name}_sweep.csv"
        )
        results = run_analysis(
            flowsheet=flowsheet,
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
            else:
                conversion_factor = conversion_factors[i]
                value[i] = value[i] * conversion_factor
    results_table["keys"] = keys
    results_table["num_parameters"] = len(parameters)
    results_table["num_outputs"] = len(output_params)
    return results_table
