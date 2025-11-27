const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const iconSourcePath = path.join(__dirname, '../assets/liftr-icon.jpg');
const iconDestPath = path.join(distPath, 'liftr-icon.jpg');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at:', indexPath);
  process.exit(1);
}

// Copy icon file to dist folder if it doesn't exist
if (fs.existsSync(iconSourcePath)) {
  if (!fs.existsSync(iconDestPath)) {
    fs.copyFileSync(iconSourcePath, iconDestPath);
    console.log('Copied liftr-icon.jpg to dist folder');
  }
} else {
  console.warn('Warning: liftr-icon.jpg not found at:', iconSourcePath);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Check if iOS meta tags already exist
if (html.includes('apple-touch-icon')) {
  console.log('iOS meta tags already exist in index.html');
  process.exit(0);
}

// Find the closing </head> tag and insert iOS meta tags before it
const iosMetaTags = `
    <!-- iOS Home Screen Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/liftr-icon.jpg" />
    <link rel="apple-touch-icon" href="/liftr-icon.jpg" />
    
    <!-- iOS Web App Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="لیفتر" />
`;

// Insert before </head>
html = html.replace('</head>', `${iosMetaTags}\n  </head>`);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully injected iOS meta tags into index.html');

