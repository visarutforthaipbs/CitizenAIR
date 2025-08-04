# CitizenAIR Deployment Guide

## Production Deployment Checklist

### ✅ Pre-Deployment Setup

- [x] PWA manifest configured with Thai language support
- [x] Service worker implemented for offline functionality
- [x] SEO optimization with OpenGraph and Twitter Cards
- [x] Security headers configured (.htaccess)
- [x] Favicon and app icons created
- [x] 404 error page created
- [x] Robots.txt and sitemap.xml generated
- [ ] Screenshots captured for PWA installation
- [ ] SSL certificate configured
- [ ] Domain DNS settings verified

### 🚀 Build Process

```bash
# 1. Install dependencies
npm install

# 2. Run production build
npm run build

# 3. Test production build locally
npm run preview

# 4. Verify PWA functionality
# Check manifest, service worker, offline mode
```

### 📂 Server Configuration

#### Apache (.htaccess)

Already configured with:

- Security headers (CSP, HSTS, X-Frame-Options)
- Cache control for static assets
- Gzip compression
- HTTPS redirects

#### Nginx (Alternative)

```nginx
server {
    listen 80;
    server_name citizenair.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name citizenair.example.com;

    # SSL configuration
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # PWA headers
    location /manifest.json {
        add_header Cache-Control "public, max-age=86400";
    }

    location /sw.js {
        add_header Cache-Control "public, max-age=0";
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    try_files $uri $uri/ /index.html;
}
```

### 🔧 Environment Variables

Create `.env.production`:

```env
# API Configuration
VITE_API_BASE_URL=https://api.citizenair.example.com
VITE_NOTION_API_KEY=your_notion_api_key

# Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true
```

### 📊 Performance Optimization

#### Vite Build Optimization

```javascript
// vite.config.js additions
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts"],
          maps: ["react-leaflet", "leaflet"],
          ui: ["@chakra-ui/react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

#### Image Optimization

- Compress images using tools like ImageOptim or TinyPNG
- Use WebP format where supported
- Implement lazy loading for map images

### 🌐 CDN Configuration

#### Cloudflare Settings

- Enable "Always Use HTTPS"
- Set "Security Level" to Medium
- Enable "Brotli Compression"
- Configure "Page Rules" for cache optimization:
  - `*.js`, `*.css`: Cache Everything, Edge TTL 1 month
  - `/api/*`: Bypass cache
  - `/sw.js`: Cache Everything, Edge TTL 2 hours

### 📱 PWA Verification

After deployment, test:

1. **Install prompt**: Visit on mobile/desktop Chrome
2. **Offline functionality**: Disconnect internet, verify app works
3. **Cache updates**: Deploy new version, verify cache invalidation
4. **Push notifications**: Test if implemented
5. **App shortcuts**: Verify manifest shortcuts work

### 🔍 SEO Verification

Use these tools to verify SEO setup:

- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/)

### 📈 Monitoring & Analytics

#### Error Tracking

Consider integrating:

- Sentry for error monitoring
- LogRocket for user session replay
- Google Analytics for usage tracking

#### Performance Monitoring

- Core Web Vitals tracking
- Service worker update monitoring
- API response time tracking

### 🔄 Update Process

#### For App Updates:

1. Update version in `package.json`
2. Build and deploy
3. Service worker will auto-update cached content
4. Users get update notification on next visit

#### For Emergency Updates:

1. Use service worker `skipWaiting()` for immediate updates
2. Show user notification to refresh
3. Clear cache if needed

### 🔐 Security Checklist

- [x] HTTPS enforced
- [x] Security headers configured
- [x] Content Security Policy (CSP) implemented
- [x] XSS protection enabled
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all forms
- [ ] Regular security audits

### 📋 Launch Checklist

#### Before Go-Live:

- [ ] All Thai text verified by native speaker
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness tested on various devices
- [ ] Performance budget verified (< 3s load time)
- [ ] PWA audit score > 90
- [ ] Accessibility audit passed
- [ ] All links and functionality tested

#### Post-Launch:

- [ ] Monitor error rates and performance
- [ ] Set up uptime monitoring
- [ ] Configure backup procedures
- [ ] Plan content update workflows
- [ ] Collect user feedback and analytics

## Support Contacts

- **Technical Issues**: technical@citizenair.example.com
- **Content Updates**: content@citizenair.example.com
- **General Inquiries**: info@citizenair.example.com

---

🌟 **CitizenAIR is now ready for production deployment with full PWA capabilities, SEO optimization, and security measures!**
