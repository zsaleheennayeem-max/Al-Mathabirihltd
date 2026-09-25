import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicUploads = path.join(__dirname, '..', 'public', 'uploads');
const srcAssets = path.join(__dirname, '..', 'src', 'assets', 'images');

if (!fs.existsSync(publicUploads)) fs.mkdirSync(publicUploads, { recursive: true });
if (!fs.existsSync(srcAssets)) fs.mkdirSync(srcAssets, { recursive: true });

// Primary Logo SVG (Horizontal layout: Shield emblem + AL MATHABIRIH HUMAN RESOURCE CO. / EquipWorkforce Global)
const primaryLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" width="800" height="240">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background container for high-contrast crispness -->
  <rect width="800" height="240" rx="16" fill="#ffffff" fill-opacity="0"/>

  <!-- Logo Mark (Shield & Dynamic Geometric Pillars) -->
  <g transform="translate(30, 25)" filter="url(#shadow)">
    <!-- Base Shield -->
    <path d="M95 10 L165 42 C165 110, 135 155, 95 180 C55 155, 25 110, 25 42 Z" fill="#0f172a" />
    <!-- Gradient Inner Crest -->
    <path d="M95 24 L152 50 C152 104, 128 142, 95 164 C62 142, 38 104, 38 50 Z" fill="url(#primaryGrad)" />
    
    <!-- Stylized Human Resource & Industrial Wings (W / M / Team Geometry) -->
    <path d="M95 44 L132 80 L118 80 L95 58 L72 80 L58 80 Z" fill="#ffffff" opacity="0.95"/>
    <path d="M95 68 L126 102 L112 102 L95 84 L78 102 L64 102 Z" fill="#38bdf8" />
    <path d="M95 92 L120 124 L108 124 L95 108 L82 124 L70 124 Z" fill="url(#accentGrad)" />

    <!-- Core Golden Star/Sparkle of Quality -->
    <circle cx="95" cy="140" r="6" fill="#ffffff" />
  </g>

  <!-- Typography: Brand Name -->
  <g transform="translate(240, 50)">
    <!-- Arabic / Primary Corporate Name -->
    <text x="0" y="44" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" letter-spacing="1.5" fill="#0f172a">
      AL MATHABIRIH
    </text>
    
    <text x="350" y="44" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24" letter-spacing="2" fill="#2563eb">
      HR CO.
    </text>

    <!-- Subtitle / English Operations Division -->
    <text x="0" y="84" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" letter-spacing="3" fill="#1e40af">
      EQUIPWORKFORCE GLOBAL
    </text>

    <!-- Accreditation & Standards Line -->
    <text x="0" y="118" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="13" letter-spacing="1.2" fill="#64748b">
      INTERNATIONAL MANPOWER SUPPLY &amp; TECHNICAL RECRUITMENT · ISO 9001
    </text>

    <line x1="0" y1="134" x2="520" y2="134" stroke="#e2e8f0" stroke-width="2" />
  </g>
</svg>`;

// Dark Mode Logo SVG
const darkLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" width="800" height="240">
  <defs>
    <linearGradient id="primaryGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="accentGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>

  <rect width="800" height="240" rx="16" fill="#0f172a"/>

  <!-- Logo Mark -->
  <g transform="translate(30, 25)">
    <path d="M95 10 L165 42 C165 110, 135 155, 95 180 C55 155, 25 110, 25 42 Z" fill="#1e293b" />
    <path d="M95 24 L152 50 C152 104, 128 142, 95 164 C62 142, 38 104, 38 50 Z" fill="url(#primaryGradDark)" />
    
    <path d="M95 44 L132 80 L118 80 L95 58 L72 80 L58 80 Z" fill="#ffffff" opacity="0.95"/>
    <path d="M95 68 L126 102 L112 102 L95 84 L78 102 L64 102 Z" fill="#bae6fd" />
    <path d="M95 92 L120 124 L108 124 L95 108 L82 124 L70 124 Z" fill="url(#accentGradDark)" />

    <circle cx="95" cy="140" r="6" fill="#ffffff" />
  </g>

  <!-- Typography -->
  <g transform="translate(240, 50)">
    <text x="0" y="44" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" letter-spacing="1.5" fill="#f8fafc">
      AL MATHABIRIH
    </text>
    <text x="350" y="44" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24" letter-spacing="2" fill="#60a5fa">
      HR CO.
    </text>
    <text x="0" y="84" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" letter-spacing="3" fill="#93c5fd">
      EQUIPWORKFORCE GLOBAL
    </text>
    <text x="0" y="118" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="13" letter-spacing="1.2" fill="#94a3b8">
      INTERNATIONAL MANPOWER SUPPLY &amp; TECHNICAL RECRUITMENT · ISO 9001
    </text>
    <line x1="0" y1="134" x2="520" y2="134" stroke="#334155" stroke-width="2" />
  </g>
</svg>`;

async function run() {
  console.log('Generating crisp corporate logo files...');

  // Save SVGs
  fs.writeFileSync(path.join(publicUploads, 'company_logo_primary.svg'), primaryLogoSvg);
  fs.writeFileSync(path.join(publicUploads, 'company_logo_dark.svg'), darkLogoSvg);
  fs.writeFileSync(path.join(srcAssets, 'company_logo_primary.svg'), primaryLogoSvg);

  // Generate PNGs using Sharp
  const primaryPngBuffer = await sharp(Buffer.from(primaryLogoSvg))
    .png({ quality: 100 })
    .toBuffer();

  const darkPngBuffer = await sharp(Buffer.from(darkLogoSvg))
    .png({ quality: 100 })
    .toBuffer();

  // Generate crisp JPEG for the exact missing upload filename that caused "corrupted picture"
  // Target: /uploads/1790256971448-27817493-1777886149995.jpg
  const missingJpegBuffer = await sharp(Buffer.from(primaryLogoSvg))
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(
    path.join(publicUploads, '1790256971448-27817493-1777886149995.jpg'),
    missingJpegBuffer
  );
  console.log('Restored public/uploads/1790256971448-27817493-1777886149995.jpg');

  // Also save PNG versions
  fs.writeFileSync(path.join(publicUploads, 'company_logo_primary.png'), primaryPngBuffer);
  fs.writeFileSync(path.join(publicUploads, 'company_logo_dark.png'), darkPngBuffer);
  fs.writeFileSync(path.join(srcAssets, 'company_logo_primary.png'), primaryPngBuffer);

  // Also copy to dist if dist exists
  const distUploads = path.join(__dirname, '..', 'dist', 'uploads');
  if (fs.existsSync(distUploads)) {
    fs.writeFileSync(
      path.join(distUploads, '1790256971448-27817493-1777886149995.jpg'),
      missingJpegBuffer
    );
    fs.writeFileSync(path.join(distUploads, 'company_logo_primary.svg'), primaryLogoSvg);
    fs.writeFileSync(path.join(distUploads, 'company_logo_primary.png'), primaryPngBuffer);
    console.log('Copied assets to dist/uploads');
  }

  console.log('All logo assets successfully generated!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
