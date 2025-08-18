#!/bin/bash

# Naveenbook Backend API - Vercel Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting Naveenbook Backend API Deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_status "Checking project dependencies..."
npm install

print_status "Running tests..."
npm test

if [ $? -ne 0 ]; then
    print_warning "Tests failed, but continuing with deployment..."
fi

# Check if this is a Git repository
if [ ! -d ".git" ]; then
    print_status "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
    print_warning "Please add a remote repository and push your code:"
    echo "git remote add origin <your-repository-url>"
    echo "git branch -M main"
    echo "git push -u origin main"
else
    print_status "Git repository found. Checking for changes..."
    if [ -n "$(git status --porcelain)" ]; then
        print_status "Committing changes..."
        git add .
        git commit -m "Update for Vercel deployment - $(date)"
    else
        print_status "No changes to commit."
    fi
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

print_status "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    print_status "Your API should now be live on Vercel."
    print_status "Check your Vercel dashboard for the deployment URL."
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi

print_status "Deployment script completed!"
print_status "Next steps:"
echo "1. Check your Vercel dashboard for the deployment URL"
echo "2. Test your API endpoints"
echo "3. Update your frontend to use the new API URL"
echo "4. Set up environment variables if needed" 