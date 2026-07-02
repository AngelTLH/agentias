@echo off
title Lanzador de Dashboard de Agentias
color 0A
cls
echo ====================================================================
echo.
echo        _                              _   _                 
echo       / \     __ _    ___   _ __     ^| ^|_^(^)^|  __ _   ___ 
echo      / _ \   / _` /  / _ \ ^| '_ \    ^| __^| ^| / _` / / __^|
echo     / ___ \ ^| (_^| ^| ^|  __/ ^| ^| ^| ^|   ^| ^|_^| ^|^| (_^| ^| \__ \
echo    /_/   \_\ \__, ^|  \___^| ^|_^| ^|_^|    \__^|_^| \__,_^| ^|___/
echo              ^|___/                                          
echo.
echo ====================================================================
echo   Distribucion de Agentias (Version V3.7.0)
echo   Desarrollado por: Angel Llanos Herrera
echo   Para errores o mejoras contactar a: angel.llanos.herrera@gmail.com
echo ====================================================================
echo   Apoya el proyecto:
echo     Ko-fi:           https://ko-fi.com/angelllanos
echo     GitHub Sponsors: https://github.com/sponsors/AngelTLH
echo ====================================================================
echo.
echo [1/2] Abriendo el navegador en http://localhost:3000 ...
echo.
start "" "http://localhost:3000"
echo [2/2] Ejecutando el servidor local de Python...
echo (Presiona Ctrl+C en esta consola para detener el servidor)
echo.
python "%~dp0Agentias_Vault\Dashboard\server.py"
pause
