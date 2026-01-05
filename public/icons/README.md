# PWA Icons

Icons untuk Progressive Web App (PWA) Sebarulang.

## Current Status

⚠️ **Note**: Saat ini menggunakan SVG placeholder icons. Untuk production, **PNG files diperlukan** untuk kompatibilitas browser yang lebih baik, terutama untuk maskable icons.

## Required Sizes

- 72x72.png
- 96x96.png
- 128x128.png
- 144x144.png
- 152x152.png
- 192x192.png (required minimum)
- 384x384.png
- 512x512.png (required minimum)
- 180x180.png (Apple touch icon)

## Generating Icons

### Option 1: Online Tools (Recommended)
1. Visit https://realfavicongenerator.net/
2. Upload your logo/icon (recommended: 512x512 or larger)
3. Configure settings:
   - Android Chrome: All sizes
   - iOS: 180x180
   - Maskable icons: Yes
4. Download and extract to `public/icons/`

### Option 2: Using ImageMagick
```bash
# Convert SVG to PNG
for size in 72 96 128 144 152 192 384 512 180; do
  convert -background none -resize ${size}x${size} logo.svg public/icons/icon-${size}x${size}.png
done

# For Apple touch icon
convert -background none -resize 180x180 logo.svg public/icons/apple-touch-icon.png
```

### Option 3: Manual Design
- Use design tools (Figma, Adobe Illustrator, etc.)
- Export as PNG with transparent background
- Ensure icons are maskable (safe zone: 80% of icon area)

## Current Status

Placeholder SVG icons have been generated. Replace with actual PNG icons before production deployment.

