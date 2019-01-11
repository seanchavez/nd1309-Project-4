/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {
  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    this.addBlock(new Block('Genesis Block!'));
    //this.generateGenesisBlock();
    //this.addBlock(new Block('First block in the chain - Genesis block'));
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  //  generateGenesisBlock() {

  //}

  // Get block height, it is auxiliar method that return the height of the blockchain
  async getBlockHeight() {
    return this.bd.getBlocksCount();
  }

  // Add new block
  async addBlock(block) {
    // await this.getBlockHeight().then(height => {
    //   if (height) {
    //     console.log('Height: ', height);
    //     block.height = parseInt(height) + 1;
    //   }
    // });

    const height = parseInt(await this.getBlockHeight());
    block.height = height;

    block.timeStamp = new Date()
      .getTime()
      .toString()
      .slice(0, -3);

    console.log('Height: ', block.height);

    if (height > 0) {
      const prevBlock = JSON.parse(await this.getBlock(height - 1));
      //console.log('prevBlock: ', prevBlock.hash);
      block.previousHash = prevBlock.hash;
    }
    block.hash = SHA256(JSON.stringify(block)).toString();

    return await this.bd.addLevelDBData(block.height, JSON.stringify(block));
  }

  // Get Block By Height
  async getBlock(height) {
    return JSON.parse(this.bd.getLevelDBData(height.toString));
  }

  // Validate if Block is being tampered by Block Height
  async validateBlock(height) {
    try {
      const block = JSON.parse(await this.getBlock(height));
      const blockHash = block.hash;
      block.hash = '';
      const validBlockHash = SHA256(JSON.stringify(block)).toString();
      if (blockHash === validBlockHash) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Validate Blockchain
  async validateChain() {
    const errorLog = [];
    for (let i = 0; i < this.validateChain.length - 1; i++) {
      if (!this.validateBlock(i)) {
        errorLog.push(i);
      }
      const block = await this.getBlock(i);
      const nextBlock = await this.getBlock(i + 1);
      if (nextBlock && block.hash !== nextBlock.previousHash) {
        errorLog.push(i);
      }
    }
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .addLevelDBData(height, JSON.stringify(block).toString())
        .then(blockModified => {
          resolve(blockModified);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports = Blockchain;
