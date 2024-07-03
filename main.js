const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Jimp = require('jimp');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('process-image', async (event, filePath) => {
    try {
      const image = await Jimp.read(filePath);
      image.resize(500, 500);

      const width = image.bitmap.width;
      const height = image.bitmap.height;

      const ymlObject = {};
      const colorSet = new Set();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = image.getPixelColor(x, y);
          const hexColor = Jimp.intToRGBA(color);
          const hex = `#${hexColor.r.toString(16).padStart(2, '0')}${hexColor.g.toString(16).padStart(2, '0')}${hexColor.b.toString(16).padStart(2, '0')}`;

          ymlObject[`${x}x${y}`] = hex;
          colorSet.add(hex);
        }
      }

      const ymlData = yaml.dump(ymlObject);

      const ymlObjectPath = path.join(__dirname, 'YML_object.yml');
      fs.writeFileSync(ymlObjectPath, ymlData);

      const uniqueColors = Array.from(colorSet);
      if (uniqueColors.length < 26) {
        event.sender.send('alert', 'Image not applicable, try a new one.');
      } else {
        const colorMapping = uniqueColors.slice(0, 26).reduce((acc, color, index) => {
          acc[`${color}`] = String.fromCharCode(97 + index);
          return acc;
        }, {});

        const colorYmlData = yaml.dump(colorMapping);

        const ymlAlphaPath = path.join(__dirname, 'YML_alpha.yml');
        fs.writeFileSync(ymlAlphaPath, colorYmlData);
      }

      event.sender.send('process-image-reply', 'Image processed and YAML files saved.');
    } catch (error) {
      console.error('Error processing image:', error);
      event.sender.send('alert', 'Failed to process image.');
    }
  });

  ipcMain.on('encode-message', (event, message) => {
    try {
      const ymlAlphaPath = path.join(__dirname, 'YML_alpha.yml');
      const ymlObjectPath = path.join(__dirname, 'YML_object.yml');

      const ymlAlphaContent = fs.readFileSync(ymlAlphaPath, 'utf8');
      const ymlObjectContent = fs.readFileSync(ymlObjectPath, 'utf8');

      const ymlAlpha = yaml.load(ymlAlphaContent);
      const ymlObject = yaml.load(ymlObjectContent);

      const messageArray = message.toLowerCase().split('');

      const encodedMessage = messageArray.map(char => {
        if (char === ' ') {
          return ':'; 
        } else {
          const hex = Object.keys(ymlAlpha).find(key => ymlAlpha[key] === char);
          if (hex) {
            const coordinates = Object.keys(ymlObject).find(key => ymlObject[key] === hex);
            if (coordinates) {
              return coordinates;
            }
          }
          return ''; 
        }
      });

      const encodedCoordinates = encodedMessage.join(':');
      event.sender.send('encoded-message', encodedCoordinates);
    } catch (error) {
      console.error('Error encoding message:', error);
      event.sender.send('alert', 'Failed to encode message.');
    }
  });

  ipcMain.on('decode-message', (event, coordinates) => {
    try {
      const ymlAlphaPath = path.join(__dirname, 'YML_alpha.yml');
      const ymlObjectPath = path.join(__dirname, 'YML_object.yml');

      const ymlAlphaContent = fs.readFileSync(ymlAlphaPath, 'utf8');
      const ymlObjectContent = fs.readFileSync(ymlObjectPath, 'utf8');

      const ymlAlpha = yaml.load(ymlAlphaContent);
      const ymlObject = yaml.load(ymlObjectContent);

      const coordinatesArray = coordinates.split(':');
      const decodedMessage = [];

      coordinatesArray.forEach(coord => {
        if (coord === '') {
          decodedMessage.push(' ');
        } else {
          const hex = ymlObject[coord];
          if (hex) {
            const letter = ymlAlpha[hex];
            if (letter) {
              decodedMessage.push(letter);
            }
          }
        }
      });

      event.sender.send('decoded-message', decodedMessage.join(''));
    } catch (error) {
      console.error('Error decoding coordinates:', error);
      event.sender.send('alert', 'Failed to decode coordinates.');
    }
  });

});

app.on('window-all-closed', () => {
  app.quit();
});