# 🚀 Quick Deploy to Vercel

## Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account ([sign up here](https://vercel.com))

## Option 1: One-Click Deploy (Recommended)

1. **Click the Deploy Button**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/naveenbook-backend)

2. **Configure Project**:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Deploy**: Click "Deploy"

## Option 2: Manual Deployment

### Step 1: Push to Git
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote and push
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure settings (Node.js framework)
5. Click "Deploy"

### Step 3: Deploy via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

## Option 3: Automated Scripts

### For Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### For Windows:
```cmd
deploy.bat
```

## Your API Will Be Available At:
- **Base URL**: `https://your-project-name.vercel.app`
- **Health Check**: `https://your-project-name.vercel.app/`
- **API Endpoints**: `https://your-project-name.vercel.app/api/*`

## Test Your Deployment:
```bash
# Health check
curl https://your-project-name.vercel.app/

# Get customers
curl https://your-project-name.vercel.app/api/customers

# Get transactions
curl https://your-project-name.vercel.app/api/transactions
```

## Next Steps:
1. ✅ Update your frontend to use the new API URL
2. ✅ Set up environment variables if needed
3. ✅ Configure custom domain (optional)
4. ✅ Set up monitoring and alerts

## Need Help?
- 📖 Read the full [DEPLOYMENT.md](DEPLOYMENT.md) guide
- 🐛 Check [Troubleshooting](DEPLOYMENT.md#troubleshooting) section
- 💬 Join Vercel community discussions 