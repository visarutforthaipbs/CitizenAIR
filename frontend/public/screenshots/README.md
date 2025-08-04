# CitizenAIR PWA Screenshots

This directory contains screenshots for the Progressive Web App (PWA) manifest.

## Required Screenshots

According to the Web App Manifest specification, we need:

### Wide Screenshots (for desktop PWA installation)

- **Size**: 2560x1440 or similar wide aspect ratio
- **Purpose**: Show the app in desktop/tablet landscape view
- **Filename**: `screenshot-wide.png`

### Narrow Screenshots (for mobile PWA installation)

- **Size**: 1080x1920 or similar portrait aspect ratio
- **Purpose**: Show the app in mobile portrait view
- **Filename**: `screenshot-mobile.png`

## Creating Screenshots

To create proper screenshots:

1. **Run the development server**: `npm run dev`
2. **Open in browser** at `http://localhost:5173`
3. **Navigate to key pages**:
   - Map page with PM2.5 data
   - Solutions page with word cloud
4. **Take screenshots** using browser dev tools or screenshot tools
5. **Resize and optimize** for web use

## File Locations

Place the screenshot files in `/public/screenshots/`:

- `/public/screenshots/screenshot-wide.png`
- `/public/screenshots/screenshot-mobile.png`

These are already referenced in the PWA manifest but need actual image files.

## Image Specifications

- **Format**: PNG (preferred) or JPG
- **Wide**: 2560x1440px (16:9 aspect ratio)
- **Mobile**: 1080x1920px (9:16 aspect ratio)
- **File size**: Keep under 1MB each for fast loading
- **Content**: Show actual Thai air quality data and interface
