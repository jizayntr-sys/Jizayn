@echo off
cls
echo ========================================
echo   Jizayn - Tam Temizlik ve Restart
echo ========================================
echo.
echo Mevcut serverlar durduruluyor...
taskkill /F /IM node.exe 2>nul
echo.
echo Cache temizleniyor...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo.
echo Eksik paketler kontrol ediliyor...
call npm install
echo.
echo Development server baslatiliyor...
echo.
echo URL: http://localhost:3000/tr
echo.
echo ========================================
echo.

call npm run dev

pause

