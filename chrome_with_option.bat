@echo off

cd "C:\Program Files (x86)\Google\Chrome\Application\"
start chrome.exe --allow-file-access-from-files %~dp0\index.html