@echo off
REM Naveenbook Backend API - Vercel Deployment Script for Windows
REM This script automates the deployment process to Vercel

echo 🚀 Starting Naveenbook Backend API Deployment to Vercel...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo [INFO] Checking project dependencies...
npm install

echo [INFO] Running tests...
npm test

if %errorlevel% neq 0 (
    echo [WARNING] Tests failed, but continuing with deployment...
)

REM Check if this is a Git repository
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    echo [WARNING] Please add a remote repository and push your code:
    echo git remote add origin ^<your-repository-url^>
    echo git branch -M main
    echo git push -u origin main
) else (
    echo [INFO] Git repository found. Checking for changes...
    git status --porcelain >nul 2>&1
    if %errorlevel% equ 0 (
        echo [INFO] Committing changes...
        git add .
        git commit -m "Update for Vercel deployment - %date% %time%"
    ) else (
        echo [INFO] No changes to commit.
    )
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing Vercel CLI...
    npm install -g vercel
)

echo [INFO] Deploying to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo [SUCCESS] Deployment completed successfully!
    echo [INFO] Your API should now be live on Vercel.
    echo [INFO] Check your Vercel dashboard for the deployment URL.
) else (
    echo [ERROR] Deployment failed. Please check the error messages above.
    pause
    exit /b 1
)

echo [INFO] Deployment script completed!
echo [INFO] Next steps:
echo 1. Check your Vercel dashboard for the deployment URL
echo 2. Test your API endpoints
echo 3. Update your frontend to use the new API URL
echo 4. Set up environment variables if needed

pause 