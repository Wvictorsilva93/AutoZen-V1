@echo off
REM AutoZen Development Server
echo ========================================
echo   AutoZen - Servidor de Desenvolvimento
echo ========================================
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo [AVISO] Arquivo .env.local nao encontrado!
    echo Execute setup.bat primeiro
    pause
    exit /b 1
)

echo Iniciando servidor...
echo.
echo Acesse: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev
