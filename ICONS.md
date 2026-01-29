# Icon Generation Instructions

The app currently uses placeholder SVG icons. For production, you should create proper PNG icons.

## Quick Option: Online Icon Generator

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 image with your logo/design
3. Generate icons for all sizes
4. Download and replace the files in `/public/`

## Manual Option: Create Your Own

### Requirements:
- 192x192 pixels (for Android)
- 512x512 pixels (for splash screens)
- PNG format
- Transparent or solid background (#081F44 recommended)

### Design Tips:
- Use simple, recognizable icon (like 📊 chart emoji or your business logo)
- Keep design centered with padding
- Use high contrast colors
- Test on both light and dark backgrounds

### Design Software Options:
- **Figma** (free): https://figma.com
- **Canva** (free): https://canva.com
- **Photoshop/GIMP** (desktop apps)

## What to Create:

1. **icon-192.png** (192x192)
   - Used for app icon on Android home screen
   - Should be clear and recognizable at small size

2. **icon-512.png** (512x512)
   - Used for splash screen
   - Can have more detail

## After Creating Icons:

1. Save them as `icon-192.png` and `icon-512.png`
2. Place them in the `public` folder
3. Update `public/manifest.json`:
   ```json
   "icons": [
     {
       "src": "/icon-192.png",
       "sizes": "192x192",
       "type": "image/png",
       "purpose": "any maskable"
     },
     {
       "src": "/icon-512.png",
       "sizes": "512x512",
       "type": "image/png",
       "purpose": "any maskable"
     }
   ]
   ```
4. Delete the `.svg` files
5. Rebuild: `npm run build`

## Current Placeholders

The SVG files (`icon-192.svg` and `icon-512.svg`) show a 📊 chart emoji on #081F44 background. They work but PNG is preferred for better browser support.

## Need Help?

Search online for:
- "PWA icon generator"
- "App icon creator"
- "Convert image to PWA icons"
