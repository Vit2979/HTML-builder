const fs = require('fs');
const path = require('path');

const stylesDirection = path.join(__dirname, '/styles');
const sheet = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
  (n) => {
    if (n) {
      return console.error(n);
    }
  },
);

fs.readdir(stylesDirection, { withFileTypes: true }, (n, files) => {
  if (n) {
    return console.error(n);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const elementDirection = path.join(stylesDirection, file.name);
      const elementExtension = path.extname(elementDirection).slice(1);

      if (elementExtension === 'css') {
        const readStream = fs.createReadStream(elementDirection, 'utf-8');
        let data = '';

        readStream.on('data', (chunk) => (data += chunk));
        readStream.on('end', () => {
          sheet.write(data.trim());
          sheet.write('\n\n');
        });
        readStream.on('error', (n) => {
          if (n) {
            return console.error(n);
          }
        });
      }
    }
  });
});