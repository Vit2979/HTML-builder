
const path = require('path');
const fs = require('fs/promises');

const dirPath = path.join(__dirname, '/secret-folder');

fs.readdir(dirPath, { withFileTypes: true })
  .then((files) => {
    files.forEach(async (file) => {
      if (file.isFile()) {
        const pathFile = path.join(dirPath, file.name);
        const st = await fs.stat(pathFile);
        const fileSize = (st.size / 1024);
        const fileExtension = path.parse(pathFile);
        console.log(fileExtension.name + ' - ' + fileExtension.ext.slice(1) + ' - ' + fileSize + ' Kb ');
      }    
    });
  });

