@echo off
echo ================================================
echo   AUTOZEN - INSTALACAO AUTOMATICA
echo ================================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js instalado!
echo.

echo [2/3] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO na instalacao das dependencias!
    pause
    exit /b 1
)
echo OK - Dependencias instaladas!
echo.

echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ================================================
echo   AUTOZEN RODANDO EM:
echo   http://localhost:3000
echo ================================================
echo.
echo Pressione Ctrl+C para encerrar o servidor
echo.

call npm run dev
