
const fs = require('fs');
const path = require('path');

const assetsTransferDirection = path.join(__dirname, '/project-dist/assets');
const assetsDirection = path.join(__dirname, '/assets');
const stylesDirection = path.join(__dirname, '/styles');
const sampleDirection = path.join(__dirname, 'template.html');
const htmlDirection = path.join(__dirname, 'project-dist', 'index.html');


fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (n) => {
  if (n) {
    return console.error(n);
  }
});


const folderTransfer = (folderDirection, folderTransferDirection) => {
  fs.rm(folderTransferDirection, { recursive: true, force: true }, (n) => {
    if (n) {
      return console.error(n);
    }

    fs.mkdir(folderTransferDirection, { recursive: true }, (n) => {
      if (n) {
        return console.error(n);
      }
    });

    fs.readdir(folderDirection, { withFileTypes: true }, (n, elements) => {
      if (n) {
        return console.error(n);
      }

      elements.forEach((element) => {
        const fileDirection = path.join(folderDirection, element.name);
        const fileTransferDirection = path.join(folderTransferDirection, element.name);

        if (element.isFile()) {
          fs.copyFile(fileDirection, fileTransferDirection, (n) => {
            if (n) {
              return console.error(n);
            }
          });
        }

        if (element.isDirectory()) {
          folderTransfer(fileDirection, fileTransferDirection);
        }
      });
    });
  });
};

folderTransfer(assetsDirection, assetsTransferDirection);


const sheet = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
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

  files.forEach((element) => {
    if (element.isFile()) {
      const elementDirection = path.join(stylesDirection, element.name);
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


fs.copyFile(sampleDirection, htmlDirection, (n) => {
  if (n) {
    return console.error(n);
  }
});

fs.readFile(sampleDirection, 'utf-8', (n, data) => {
  if (n) console.log(n);

  let sampleInfo = data;
  const sampleTags = data.match(/{{\w+}}/gm);

  for (let label of sampleTags) {
    const labelDirection = path.join(
      __dirname,
      '/components',
      `${label.slice(2, -2)}.html`,
    );

    fs.readFile(labelDirection, 'utf-8', (n, dataLabel) => {
      if (n) console.log(n);

      sampleInfo = sampleInfo.replace(label, dataLabel);

      fs.rm(htmlDirection, { recursive: true, force: true }, (n) => {
        if (n) {
          return console.error(n);
        }
        const html = fs.createWriteStream(htmlDirection);
        html.write(sampleInfo);
      });
    });
  }
});
