const fs = require('fs');
const path = require('path');

// Direktori web-build setelah build
const webBuildDir = path.join(__dirname, 'web-build');

// Fungsi untuk membaca semua file dalam direktori secara rekursif
function readDirRecursive(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Rekursif untuk subdirektori
      results.push(...readDirRecursive(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
}

// Fungsi untuk memeriksa dan memperbaiki tipe MIME
function fixMimeTypes() {
  try {
    // Baca semua file dalam web-build
    const allFiles = readDirRecursive(webBuildDir);
    
    // Filter file JavaScript
    const jsFiles = allFiles.filter(file => file.endsWith('.js'));
    
    // Buat file .htaccess untuk mengatur tipe MIME
    const htaccessPath = path.join(webBuildDir, '.htaccess');
    const htaccessContent = `
# Ensure JavaScript files are served with correct MIME type
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/json .json
</IfModule>

# Redirect all requests to index.html for SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /cateringta/
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /cateringta/index.html [L]
</IfModule>
    `;
    
    fs.writeFileSync(htaccessPath, htaccessContent);
    console.log('Created .htaccess file');
    
    // Salin index.html ke root untuk memastikan routing bekerja
    if (fs.existsSync(path.join(webBuildDir, 'index.html'))) {
      const indexHtml = fs.readFileSync(path.join(webBuildDir, 'index.html'), 'utf8');
      
      // Tambahkan meta tag untuk tipe MIME
      const updatedHtml = indexHtml.replace('</head>', `
  <meta http-equiv="Content-Type" content="text/javascript; charset=utf-8" />
</head>`);
      
      fs.writeFileSync(path.join(webBuildDir, 'index.html'), updatedHtml);
      console.log('Updated index.html with MIME type meta tag');
    }
    
    console.log('Fixed MIME types for all JS files');
  } catch (error) {
    console.error('Error fixing MIME types:', error);
  }
}

// Jalankan fungsi
fixMimeTypes(); 