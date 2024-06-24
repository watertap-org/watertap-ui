:: instructions
:: when building watertap ui, all packages must be installed like normal pytohn packages, rather then in dev mode, as such we 
:: will go through uninstall currently installed watertap and watertap ui packages, and install them as normal ones
:: We will then build watertap-ui backend, front end and finally install file
:: after which we will clean up and reinstall orignal watertap-dev so you can keep workign on it.

:: TO DO SO ENSURE TO  SPECIFY file directorys for watertap ui and water tap that you are developing in.
:: specify watertap ui directory (git repo)
set watertap_ui_path=D:\OneDrive\NAWI_work\Analysis\WaterTAP\watertap-ui

:: specify watertap dev directory (git repo)
set watertap_path=D:\OneDrive\NAWI_work\Analysis\WaterTAP\watertap-dev

:: activate watertap ui
call activate watertap-ui-env
echo -------------------------------------------------
echo setting up NPM
call cd %watertap_ui_path%
call npm --prefix electron clean-install
call npm --prefix electron/ui clean-install
call idaes get-extensions --verbose
