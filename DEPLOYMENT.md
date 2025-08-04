# CitizenAIR Deployment Guide

This guide covers deploying CitizenAIR to production using Vercel (frontend) and Render (backend).

## 📋 Pre-deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Environment variables configured
- [ ] Production build tested locally
- [ ] Notion API tokens ready
- [ ] Domain names decided (if custom domains needed)

## 🚀 Frontend Deployment (Vercel)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/visarutforthaipbs/CitizenAIR`
4. Select the repository and click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel dashboard, go to Settings > Environment Variables and add:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your frontend will be available at `https://your-app.vercel.app`

## 🖥️ Backend Deployment (Render)

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Select your repository: `CitizenAIR`

### Step 2: Configure Service Settings

- **Name**: `citizenair-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or paid for production)

### Step 3: Set Environment Variables

Add these environment variables in Render:

```
NODE_ENV=production
PORT=10000
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Your backend will be available at `https://your-backend-app.onrender.com`

## 🔗 Connecting Frontend and Backend

### Step 1: Update Frontend Environment

After backend deployment, update the frontend environment variable:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Update `VITE_API_BASE_URL` to your Render backend URL
3. Redeploy the frontend

### Step 2: Update Backend CORS

1. Go to Render Dashboard > Your Service > Environment
2. Update `ALLOWED_ORIGINS` to include your Vercel frontend URL
3. Redeploy the backend

## 🔍 Testing Deployment

### Frontend Tests

1. Visit your Vercel URL
2. Check that the map loads correctly
3. Verify that air quality markers appear
4. Test mobile responsiveness
5. Check browser console for errors

### Backend Tests

1. Visit `https://your-backend-app.onrender.com/api/health`
2. Should return: `{"status": "OK", "message": "CitizenAIR API is running"}`
3. Test API endpoints:
   - `GET /api/solutions` - Should return solutions data
   - `POST /api/solutions` - Should accept new solutions

### Integration Tests

1. Try submitting a new solution from the frontend
2. Verify it appears in your Notion database
3. Check that data flows correctly between frontend and backend

## 🚨 Troubleshooting

### Common Frontend Issues

**Build Fails**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check for TypeScript/linting errors

**Map Not Loading**
- Verify CSV files are in the correct `public/` directory
- Check browser console for 404 errors on data files
- Ensure SVG icons are accessible

**API Calls Failing**
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration in backend
- Verify backend is running and accessible

### Common Backend Issues

**Service Won't Start**
- Check that `PORT` environment variable is set
- Verify all required dependencies are installed
- Check server logs for specific error messages

**Notion API Errors**
- Verify `NOTION_TOKEN` is correct and has proper permissions
- Check that `NOTION_DATABASE_ID` exists and is accessible
- Ensure Notion integration is properly configured

**CORS Errors**
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check that CORS middleware is properly configured
- Ensure no trailing slashes in URLs

## 📊 Monitoring & Maintenance

### Vercel Monitoring

- Check deployment logs in Vercel dashboard
- Monitor build times and success rates
- Set up domain and SSL if using custom domain

### Render Monitoring

- Monitor service health and uptime
- Check logs for errors or performance issues
- Consider upgrading to paid plan for better performance

### Regular Maintenance

- Update dependencies regularly
- Monitor API usage and performance
- Backup Notion database regularly
- Update air quality data as needed

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

- **Frontend**: Automatically deploys when you push to `main` branch
- **Backend**: Automatically deploys when backend code changes

To set up manual deployment control:
1. Disable auto-deploy in platform settings
2. Use manual deployment triggers
3. Set up staging environments for testing

## 📱 Performance Optimization

### Frontend Optimizations

- Enable Vercel's automatic image optimization
- Use Vercel's Edge Network for faster loading
- Minimize bundle size by code splitting
- Optimize CSV and GeoJSON file sizes

### Backend Optimizations

- Use Render's HTTP/2 support
- Implement API response caching
- Optimize database queries
- Use compression middleware

## 🎯 Going Live

### Final Steps

1. ✅ Test all functionality thoroughly
2. ✅ Set up custom domains (optional)
3. ✅ Configure SSL certificates
4. ✅ Set up monitoring and alerts
5. ✅ Update DNS records if using custom domains
6. ✅ Announce your launch! 🎉

### Post-Launch

- Monitor application performance
- Gather user feedback
- Plan feature updates
- Scale services as needed

## 🆘 Support

If you encounter issues during deployment:

1. Check the deployment logs first
2. Verify all environment variables are set correctly
3. Test locally to isolate the issue
4. Consult platform-specific documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Render Docs](https://render.com/docs)

---

**Happy Deploying! 🚀**
