# 🚀 Deploying Backend to Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository

## Step-by-Step Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Backend Directory
```bash
cd backend
vercel
```

### 4. Follow the Prompts
- **Set up and deploy**: `Y`
- **Which scope**: Select your account
- **Link to existing project**: `N`
- **Project name**: `my-accounts-lite-backend` (or your preferred name)
- **In which directory is your code located**: `./` (current directory)
- **Want to override the settings**: `N`

### 5. Alternative: Deploy with Specific Settings
```bash
vercel --prod
```

## Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Environment Variables (Optional)

You can set environment variables in Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add variables like:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend-domain.com`

## API Endpoints After Deployment

Your API will be available at:
- **Base URL**: `https://your-project-name.vercel.app`
- **Health Check**: `https://your-project-name.vercel.app/api/health`
- **Dashboard**: `https://your-project-name.vercel.app/api/dashboard`
- **Customers**: `https://your-project-name.vercel.app/api/customers`
- **Transactions**: `https://your-project-name.vercel.app/api/transactions`

## Testing Deployment

### 1. Health Check
```bash
curl https://your-project-name.vercel.app/api/health
```

### 2. Test API Endpoints
```bash
# Get all customers
curl https://your-project-name.vercel.app/api/customers

# Get dashboard
curl https://your-project-name.vercel.app/api/dashboard
```

## Important Notes

### ⚠️ Data Persistence
- **Vercel uses serverless functions**
- **Data is stored in memory only**
- **Data will be reset on each function cold start**
- **For production, consider using a database service**

### 🔄 Updates
To update your deployment:
```bash
vercel --prod
```

### 📊 Monitoring
- Check Vercel dashboard for logs and performance
- Monitor function execution times
- Set up alerts for errors

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Vercel handles port management automatically
   - No need to specify port in production

2. **CORS Issues**
   - Update CORS configuration for your frontend domain
   - Add environment variable `CORS_ORIGIN`

3. **Function Timeout**
   - Vercel has a 10-second timeout for hobby plan
   - Upgrade to Pro plan for longer timeouts

4. **Memory Issues**
   - Serverless functions have memory limits
   - Optimize data handling for large datasets

### Debug Commands
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow

# Check deployment status
vercel ls
```

## Production Considerations

### Database Integration
For production use, consider:
- **MongoDB Atlas** (free tier available)
- **PostgreSQL** (Vercel Postgres)
- **Supabase** (free tier available)
- **PlanetScale** (free tier available)

### Environment Setup
```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

### Security
- Add authentication/authorization
- Implement rate limiting
- Use HTTPS (automatic with Vercel)
- Validate all inputs

## Next Steps

1. **Connect Frontend**: Update your React app to use the Vercel API URL
2. **Add Database**: Integrate a proper database for data persistence
3. **Add Authentication**: Implement user authentication
4. **Monitor Performance**: Set up monitoring and alerts
5. **Scale**: Upgrade Vercel plan if needed

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Node.js on Vercel**: [vercel.com/docs/runtimes#official-runtimes/node-js](https://vercel.com/docs/runtimes#official-runtimes/node-js) 