const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const JSZip = require('jszip');

async function packMacos() {
  const rootDir = path.resolve(__dirname, 'macos-dist');
  const outZipPath = path.resolve(__dirname, '../public/downloads/PressZero-macOS-Universal.zip');

  const zip = new JSZip();

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const fileContent = fs.readFileSync(fullPath);
        const isExecutable = relPath.endsWith('/PressZero') || relPath.endsWith('.command');
        
        zip.file(relPath, fileContent, {
          unixPermissions: isExecutable ? 0o755 : 0o644,
          comment: isExecutable ? 'Executable binary script' : ''
        });
        console.log(`Added: ${relPath} (chmod ${isExecutable ? '755' : '644'})`);
      }
    }
  }

  console.log(`Reading source files from ${rootDir}...`);
  walk(rootDir);

  console.log('Generating macOS Universal ZIP archive with UNIX file attributes...');
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    platform: 'UNIX'
  });

  fs.writeFileSync(outZipPath, content);

  const hash = crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
  console.log(`\nSuccessfully created: ${outZipPath}`);
  console.log(`Size: ${content.length} bytes`);
  console.log(`SHA-256: ${hash}`);
}

packMacos().catch(err => {
  console.error(err);
  process.exit(1);
});
