fs = require('fs');

imgReadBuffer = fs.readFileSync('favicon.png');

imgHexEncode = new Buffer(imgReadBuffer).toString('hex');

console.log(imgHexEncode);
