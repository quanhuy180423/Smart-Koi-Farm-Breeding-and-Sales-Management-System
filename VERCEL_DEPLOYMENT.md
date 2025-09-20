# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Vercel CLI** (optional): `npm i -g vercel`

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (leave as default)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

## 🔧 Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables

```env
NODE_ENV=production
```

### Optional Variables (for your app)

```env
# Database connection (if using)
DATABASE_URL=your_database_url

# API Keys (if using external services)
API_KEY=your_api_key

# Authentication secrets
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-app.vercel.app

# Email service (if using)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 🔐 GitHub Secrets Setup

For automated CI/CD, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

### Required Secrets:

- `VERCEL_TOKEN`: Your Vercel token (get from [vercel.com/account/tokens](https://vercel.com/account/tokens))
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### How to get Vercel IDs:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Get project info
vercel project ls

# Or use Vercel API
curl -X GET "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 Deployment Workflow

### Automatic Deployment

- **Push to `main` branch**: Deploys to production
- **Push to `develop` branch**: Deploys to preview
- **Pull Request**: Creates preview deployment with comment

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔍 Build Configuration

The project includes:

- **`vercel.json`**: Vercel-specific configuration
- **`.github/workflows/deploy.yml`**: GitHub Actions CI/CD pipeline
- **`next.config.ts`**: Next.js configuration with image optimization

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 20.x
- **Framework**: Next.js 15

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Configure DNS records as instructed

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to your project dashboard
2. Navigate to **Analytics** tab
3. Enable analytics for performance monitoring

### Error Tracking

Vercel provides built-in error tracking and monitoring.

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:

   ```bash
   # Check build locally
   npm run build

   # Check for TypeScript errors
   npx tsc --noEmit
   ```

2. **Environment Variables**:
   - Ensure all required env vars are set
   - Check variable names match exactly

3. **GitHub Actions Issues**:
   - Verify secrets are correctly set
   - Check Vercel token permissions

### Useful Commands:

```bash
# Check Vercel project status
vercel ls

# View build logs
vercel logs

# Redeploy
vercel redeploy

# Remove deployment
vercel rm
```

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)

## 🎯 Best Practices

1. **Environment Variables**: Never commit secrets to code
2. **Build Optimization**: Use `next/image` for images
3. **Caching**: Configure appropriate cache headers
4. **Monitoring**: Set up error tracking and analytics
5. **Backup**: Keep deployment history and rollback options

---

**Happy Deploying! 🚀**
