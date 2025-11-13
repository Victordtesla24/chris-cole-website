# Deployment Guide - Chris Cole Portfolio

## 📋 Pre-Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Build completes successfully (`npm run build`)
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Assets added to `public/assets/` directory
- [ ] Environment variables configured

## 🚀 Deploy to Render.com

### Method 1: Blueprint Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Chris Cole portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/chris-cole-portfolio.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Click "Apply" to deploy

3. **Configure Environment Variables**
   - Set `SITE_URL` to your production URL (e.g., `https://chris-cole-portfolio.onrender.com`)

### Method 2: Manual Deployment

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Service**
   - **Name**: `chris-cole-portfolio`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade as needed)

3. **Environment Variables**
   ```
   NODE_ENV=production
   SITE_URL=https://your-app-name.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~3-5 minutes)

## 🔧 Post-Deployment

### Verify Deployment
1. Visit your site URL
2. Check all sections load correctly
3. Test responsive design on mobile
4. Verify all animations work smoothly
5. Test all navigation links

### Performance Optimization
- Enable compression (automatic on Render)
- Monitor build times in dashboard
- Check Lighthouse scores

### Custom Domain (Optional)
1. Go to service settings in Render
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning (~5 minutes)

## 🐛 Troubleshooting

### Build Fails
- Check Node version compatibility (requires >= 18.0.0)
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

### Site Not Loading
- Check start command is correct (`npm start`)
- Verify port binding (Next.js uses port 3002 by default for frontend & 3001 for backed)
- Review application logs in Render dashboard

### Slow Performance
- Optimize images (use WebP format)
- Enable Render's CDN
- Consider upgrading to paid plan for better resources

## 📊 Monitoring

### Render Dashboard
- View real-time logs
- Monitor deployment history
- Check service health
- Review performance metrics

### Analytics (Optional)
Add Google Analytics:
1. Get GA tracking ID
2. Add to environment variables
3. Redeploy service

## 🔄 Updates and Redeployment

### Automatic Deployment
- Push changes to `main` branch
- Render auto-deploys (if enabled)
- Monitor build in dashboard

### Manual Deployment
- Go to service in Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"

## 💾 Backup

- Keep repository on GitHub
- Export environment variables
- Document custom configurations
- Save any uploaded assets

## 🔐 Security

- Use environment variables for sensitive data
- Enable HTTPS (automatic on Render)
- Keep dependencies updated (`npm audit fix`)
- Review security headers

## 📈 Scaling

### Free Plan Limitations
- Spins down after 15 minutes of inactivity
- 750 hours/month free tier
- Shared resources

### Upgrade Options
- Starter Plan: Always-on service
- Professional Plan: Better performance
- Custom Plans: Enterprise needs

## 📞 Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Deployment Status**: ✅ Ready for Production

