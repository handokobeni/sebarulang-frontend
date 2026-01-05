/**
 * Generate PWA Icons
 * Creates placeholder icons for PWA in various sizes
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Note: This script requires canvas package. Install with: pnpm add -D canvas
 * Or use online tools like: https://realfavicongenerator.net/
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512, 180]; // 180 for Apple touch icon

const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG template for placeholder
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#10b981" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">S</text>
</svg>`;
};

// Generate SVG placeholders
iconSizes.forEach((size) => {
  const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
  const svgContent = createSVGIcon(size);
  const svgPath = path.join(iconsDir, filename.replace('.png', '.svg'));
  
  fs.writeFileSync(svgPath, svgContent);
  // eslint-disable-next-line no-console
  console.log(`Created placeholder: ${filename.replace('.png', '.svg')}`);
});

// eslint-disable-next-line no-console
console.log('\n⚠️  Note: SVG placeholders created. For production, convert these to PNG format.');
// eslint-disable-next-line no-console
console.log('You can use online tools like: https://realfavicongenerator.net/');
// eslint-disable-next-line no-console
console.log('Or use ImageMagick: convert icon-192x192.svg icon-192x192.png');

