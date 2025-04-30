@echo off

set p=3000
set prg=%ProgramFiles%
set browser=""

start /min %cd%\miniweb.exe -p %p% -d 1 -r %cd%\..

dir "%prg%\Mozilla Firefox\firefox.exe" /s/b >nul 2>nul && set browser="%prg%\Mozilla Firefox\firefox.exe"

if %browser%=="" (
    dir "%prg%\Firefox Nightly\firefox.exe" /s/b >nul 2>nul && set browser="%prg%\Firefox Nightly\firefox.exe"
)

if %browser%=="" (
    dir "%prg%\Google\Chrome\Application\chrome.exe" /s/b >nul 2>nul && set browser="%prg%\Google\Chrome\Application\chrome.exe"
)

if %browser%=="" set /P browser=Please enter the path to the browser:

%browser% http://127.0.0.1:%p%
