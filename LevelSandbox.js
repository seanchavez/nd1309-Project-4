/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const hex2ascii = require('hex2ascii');
const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }

  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          const block = JSON.parse(value);
          if (block.body.star) {
            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
          }
          resolve(block);
        }
      });
    });
  }

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
          let block = JSON.parse(data);
          if (block.body.address === address) {
            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            blocks.push(block);
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

  getBlockByHash(hash) {
    const self = this;
    return new Promise((resolve, reject) => {
      let target = null;
      self.db
        .createValueStream()
        .on('data', function(data) {
          let block = JSON.parse(data);
          if (block.hash === hash) {
            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            target = block;
          }
        })
        .on('error', function(err) {
          reject(err);
        })
        .on('close', function() {
          resolve(target);
        });
    });
  }

  searchForStar(blockBody) {
    const self = this;
    return new Promise((resolve, reject) => {
      let found = false;
      self.db
        .createValueStream()
        .on('data', function(data) {
          let block = JSON.parse(data);
          if (
            block.height > 0 &&
            block.body.star.dec === blockBody.star.dec &&
            block.body.star.ra === blockBody.star.ra
          ) {
            found = true;
          }
        })
        .on('error', function(err) {
          reject(err);
        })
        .on('close', function() {
          resolve(found);
        });
    });
  }
}

module.exports = LevelSandbox;
