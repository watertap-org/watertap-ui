:: instructions
:: when building watertap ui, all packages must be installed like normal pytohn packages, rather then in dev mode, as such we 
:: will go through uninstall currently installed watertap and watertap ui packages, and install them as normal ones
:: We will then build watertap-ui backend, front end and finally install file
:: after which we will clean up and reinstall orignal watertap-dev so you can keep workign on it.

:: TO DO SO ENSURE TO  SPECIFY file directorys for watertap ui and water tap that you are developing in.
:: specify watertap ui directory (git repo)
set watertap_ui_path=D:\OneDrive\NAWI_work\Analysis\WaterTAP\watertap-ui
@REM set anaconda_path=D:\miniconda\Scripts\activate.bat
:: specify watertap dev directory (git repo)
set watertap_path=D:\OneDrive\NAWI_work\Analysis\WaterTAP\watertap-dev
set anaconda_path=D:\miniconda\Scripts\activate.bat
call %anaconda_path%
:: activate watertap ui
call conda activate watertap-ui-env
echo -------------------------------------------------
echo Uninstalling watertap-dev and installing into env

call cd %watertap_path% 
call echo Y|pip uninstall watertap
call pip install . 

call cd %watertap_ui_path%
echo -------------------------------------------------
echo Uninstalling watertap-ui and installing into env
call activate watertap-ui-env
echo reinstaling watertap ui if installed
call echo Y|pip uninstall watertap-ui
call pip install .
call python build_scripts/update_entry_points.py
echo -------------------------------------------------
echo building backend 
call npm --prefix electron run build-backend
echo -------------------------------------------------
echo building frontend 
call npm --prefix electron run build-frontend-win
echo -------------------------------------------------
echo building building win version
call npm --prefix electron run electron-build-win
echo -------------------------------------------------
echo done building, going reinstall watertap dev
pause

call cd %watertap_path% 
call activate watertap-ui-env
echo reinstaling watertap dev
call echo Y|pip uninstall watertap
call pip install -r requirements-dev.txt
pause