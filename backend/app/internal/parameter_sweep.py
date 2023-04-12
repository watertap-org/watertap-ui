from watertap.tools.parameter_sweep import LinearSample, parameter_sweep
import watertap.examples.flowsheets.case_studies.wastewater_resource_recovery.amo_1575_magprex.magprex as magprex
from importlib import import_module

def set_up_sensitivity(m, solve, output_params):
    outputs = {}
    optimize_kwargs = {"fail_flag": False}
    opt_function = solve

    # create outputs
    # we should have the user provide outputs as a parameter
    for each in output_params:
        outputs[each["name"]] = each["param"]
    # outputs["LCOW"] = m.fs.costing.LCOW
    # outputs["LCOT"] = m.fs.costing.LCOT

    # outputs["LCOM"] = m.fs.costing.LCOM
    # outputs["LCOH"] = m.fs.costing.LCOH
    # outputs["LCOS"] = m.fs.costing.LCOS

    return outputs, optimize_kwargs, opt_function


def run_analysis(m, flowsheet, parameters, output_params, results_path="output.csv", interpolate_nan_outputs=True):
    flowsheet = import_module(flowsheet)
    
    outputs, optimize_kwargs, opt_function = set_up_sensitivity(m, flowsheet.solve, output_params)

    sweep_params = {}
    # sensitivity analysis
    for each in parameters:
        sweep_params[each["name"]] = LinearSample(
            each["param"], each["lb"], each["ub"], each["nx"]
        )

    global_results = parameter_sweep(
        m,
        sweep_params,
        outputs,
        csv_results_file_name=results_path,
        optimize_function=opt_function,
        optimize_kwargs=optimize_kwargs,
        interpolate_nan_outputs=interpolate_nan_outputs,
    )

    return global_results


# if __name__ == "__main__":
#     results, sweep_params, m = run_analysis()