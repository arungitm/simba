# Simba Ventura FZE Website Deployment Guide

## API Requirements

Before deploying the website, you need to set up the following API endpoints:

### 1. RFQ Form API

- **Submit Endpoint**: Accepts form data and returns a request ID
- **Status Endpoint**: Retrieves the status of a submitted request

### 2. Trading Process API

- **Shipment Details Endpoint**: Retrieves shipment details and trading steps
- **Complete Action Endpoint**: Marks an action as completed
- **Notifications Endpoint**: Toggles notification settings
- **Documents Endpoint**: Retrieves documents for a shipment
- **Updates Endpoint**: Retrieves updates for a shipment

## Environment Variables

The following environment variables need to be set:

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_BASE_PATH=/
```

## Pre-Deployment Checklist

### 1. API Integration

- [ ] Set up all required API endpoints
- [ ] Test API endpoints with sample data
- [ ] Implement proper error handling
- [ ] Set up authentication if required

### 2. Environment Configuration

- [ ] Configure environment variables for production
- [ ] Set up CORS policies on the API server
- [ ] Configure rate limiting for API endpoints

### 3. Build and Test

- [ ] Run `npm run build` to create production build
- [ ] Test the production build locally using `npm run preview`
- [ ] Verify all forms and features work correctly
- [ ] Test on multiple browsers and devices

### 4. Performance Optimization

- [ ] Optimize images and assets
- [ ] Enable compression on the server
- [ ] Configure caching headers
- [ ] Verify loading performance

### 5. Final Checks

- [ ] Verify all links work correctly
- [ ] Check for any console errors
- [ ] Validate HTML and accessibility
- [ ] Review content for typos or errors

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

### 2. Deploy to Web Server

Upload the contents of the `dist` directory to your web server or hosting provider.

### 3. Configure Web Server

Ensure your web server is configured to:

- Serve the `index.html` file for all routes (for client-side routing)
- Set appropriate cache headers for static assets
- Enable HTTPS
- Configure CORS headers if needed

### 4. DNS Configuration

Update DNS records to point to your web server.

### 5. Post-Deployment Verification

- [ ] Verify the website loads correctly
- [ ] Test all forms and features
- [ ] Check analytics and monitoring tools
- [ ] Verify API connections are working

## Maintenance Plan

### Regular Updates

- Schedule regular updates for dependencies
- Monitor for security vulnerabilities
- Update content as needed

### Monitoring

- Set up uptime monitoring
- Configure error tracking
- Monitor API performance

### Backup Strategy

- Regular backups of the codebase
- Database backups if applicable
- Document recovery procedures
