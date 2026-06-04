@echo off
REM AutoZen Setup Script for Windows
echo ========================================
echo   AutoZen - Setup Inicial
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js 22+ de https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)

echo [OK] npm encontrado
npm --version
echo.

REM Install dependencies
echo ========================================
echo   Instalando dependencias...
echo ========================================
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [OK] Dependencias instaladas com sucesso!
echo.

REM Create .env.local if not exists
if not exist ".env.local" (
    echo ========================================
    echo   Criando arquivo .env.local
    echo ========================================
    echo.
    
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo [OK] Arquivo .env.local criado!
        echo.
        echo [IMPORTANTE] Configure as variaveis de ambiente em .env.local
        echo - NEXT_PUBLIC_SUPABASE_URL
        echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
        echo - SUPABASE_SERVICE_ROLE_KEY
        echo.
    ) else (
        echo [AVISO] Arquivo .env.example nao encontrado
    )
) else (
    echo [OK] Arquivo .env.local ja existe
    echo.
)

REM Setup complete
echo ========================================
echo   Setup concluido com sucesso!
echo ========================================
echo.
echo Para iniciar o projeto, execute:
echo   npm run dev
echo.
echo Acesse: http://localhost:3000
echo.

pause
