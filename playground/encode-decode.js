fs = require('fs');

const imgReadBuffer = fs.readFileSync('favicon.png');

const imgHexEncode = Buffer.from(imgReadBuffer).toString('hex');

console.log(imgReadBuffer);
console.log(imgHexEncode);

const imgHexDecode = Buffer.from(imgHexEncode, 'hex');

fs.writeFileSync('decodedHex-favicon.png', imgHexDecode);
