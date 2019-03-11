/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {
  constructor() {
    this.bd = new LevelSandbox();
    this.createGenesisBlock();
    this.mempool = {};
  }

  async createGenesisBlock() {
    if ((await this.getBlockHeight()) === -1) {
      this.addBlock(new Block('Genesis Block!'));
    }
  }

  async getBlocksWithSameAddress(address) {
    try {
      return this.bd.getBlocksByAddress(address);
    } catch (error) {
      console.error(error);
    }
  }

  async isRegistered(blockBody) {
    try {
      return this.bd.searchForStar(blockBody);
    } catch (error) {
      console.error(error);
    }
  }

  async getBlockByHash(hash) {
    try {
      return this.bd.getBlockByHash(hash);
    } catch (error) {
      console.error(error);
    }
  }

  // Get block height, it is auxiliar method that return the height of the blockchain
  async getBlockHeight() {
    try {
      const blockCount = await this.bd.getBlocksCount();
      return blockCount - 1;
    } catch (error) {
      console.error(error);
    }
  }

  async addBlock(block) {
    try {
      const chainHeight = await this.getBlockHeight();
      block.height = chainHeight + 1;

      block.time = Date.now();

      if (block.height > 0) {
        const prevBlock = await this.getBlock(chainHeight);
        block.previousBlockHash = prevBlock.hash;
      }
      block.hash = SHA256(JSON.stringify(block)).toString();

      return this.bd.addLevelDBData(
        block.height.toString(),
        JSON.stringify(block),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getBlock(height) {
    try {
      return await this.bd.getLevelDBData(height.toString());
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Blockchain;
