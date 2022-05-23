const fs = require('fs');
const path = require('path');

const folderDirection = path.join(__dirname, '/files');
const folderTransferDirection = path.join(__dirname, '/files-copy');

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

folderTransfer(folderDirection, folderTransferDirection);

