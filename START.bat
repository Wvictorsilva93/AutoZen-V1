@echo off
echo ================================================
echo   AUTOZEN - INICIANDO SERVIDOR
echo ================================================
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    pause
    exit /b 1
)

echo Iniciando AutoZen...
echo.
echo Servidor rodando em: http://localhost:3000
echo.
echo Pressione Ctrl+C para encerrar
echo.

call npm run dev
