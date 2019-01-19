/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.height = -1;
    this.timeStamp = '';
    this.body = data;
    this.previousHash = '0x';
    this.hash = '';
  }
}

module.exports = Block;
