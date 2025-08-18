# Vercel Deployment Guide for Naveenbook Backend API

This guide will help you deploy your Naveenbook Backend API to Vercel using Git.

## Prerequisites

1. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Ensure you have Node.js installed locally for testing

## Project Structure

Your project is already configured for Vercel deployment with:
- `vercel.json`: Vercel configuration file
- `package.json`: Node.js dependencies and scripts
- `server-enhanced.js`: Main server file (entry point)

## Deployment Steps

### Step 1: Prepare Your Git Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

2. **Push to Remote Repository**:
   ```bash
   git remote add origin <your-repository-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your account

2. **Import Project**:
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing your Naveenbook Backend API

3. **Configure Project**:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Environment Variables** (if needed):
   - Add any environment variables your app requires
   - Common variables:
     - `NODE_ENV=production`
     - `PORT=3000` (Vercel will set this automatically)

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm deployment settings

### Step 3: Verify Deployment

1. **Check Deployment Status**:
   - Go to your Vercel dashboard
   - Check the deployment status
   - View deployment logs if needed

2. **Test Your API**:
   - Your API will be available at: `https://your-project-name.vercel.app`
   - Test the root endpoint: `https://your-project-name.vercel.app/`
   - Test your API endpoints: `https://your-project-name.vercel.app/api/customers`

## Configuration Details

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server-enhanced.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server-enhanced.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server-enhanced.js": {
      "maxDuration": 30
    }
  }
}
```

### Key Configuration Points:
- **Entry Point**: `server-enhanced.js` (your main server file)
- **Runtime**: Node.js via `@vercel/node`
- **Routes**: All requests routed to your server
- **Function Timeout**: 30 seconds maximum
- **Environment**: Production mode

## Continuous Deployment

Once deployed, Vercel will automatically:
- Deploy new versions when you push to your main branch
- Create preview deployments for pull requests
- Provide deployment URLs for each version

## Environment Variables

If your application needs environment variables:

1. **In Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add your variables

2. **Common Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

## API Endpoints

Your deployed API will have these endpoints:
- `GET /` - Health check
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get specific customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/health` - Health check
- `GET /api/backup` - Backup data

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check `package.json` for correct dependencies
   - Verify Node.js version compatibility
   - Check build logs in Vercel dashboard

2. **Runtime Errors**:
   - Check function logs in Vercel dashboard
   - Verify environment variables are set
   - Test locally first

3. **CORS Issues**:
   - Your app already includes CORS middleware
   - If issues persist, check frontend domain configuration

### Useful Commands:

```bash
# Test locally
npm start

# Check logs
vercel logs

# Redeploy
vercel --prod

# Remove deployment
vercel remove
```

## Monitoring and Analytics

Vercel provides:
- **Analytics**: Request counts, response times
- **Logs**: Function execution logs
- **Performance**: Core Web Vitals
- **Uptime**: Service availability

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Configure allowed origins properly
3. **Rate Limiting**: Consider adding rate limiting for production
4. **Input Validation**: Ensure all inputs are validated

## Next Steps

After successful deployment:
1. Update your frontend to use the new API URL
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up database (if using external database)

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions) 