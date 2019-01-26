/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.put(key, value, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Method that return the height
  getBlocksCount() {
    let self = this;
    return new Promise((resolve, reject) => {
      let count = 0;
      self.db
        .createReadStream()
        .on('data', () => {
          count++;
        })
        .on('error', error => {
          reject(error);
        })
        .on('close', () => {
          resolve(count);
        });
    });
  }
  getBlocksByAddress(address) {
    const self = this;
    return new Promise((resolve, reject) => {
      const blocks = [];
      self.db
        .createValueStream()
        .on('data', function(data) {
          console.log('DATA:', data);
          let block = JSON.parse(data);
          if (block.body.address === address) {
            blocks.push(data);
          }
        })
        .on('error', function(err) {
          reject(err);
        })
        .on('close', function() {
          resolve(blocks);
        });
    });
  }
}

module.exports = LevelSandbox;
