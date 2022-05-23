

const fs = require('fs');
const path = require('path');
const { stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), (n) => {
  if (n) {
    return console.error(n);
  }
});

console.log('Hello! Text input! (Press the buttons to exit Ctrl+C or type "exit")');

stdin.on('data', (data) => {
  const dataString = data.toString();

  if (dataString.trim() === 'exit') {    
    console.log('Goodbye!');
    process.exit(0);
  }

  output.write(dataString);
});

process.on('SIGINT', () => { 
  console.log('Goodbye!');
  process.exit(0);
});  