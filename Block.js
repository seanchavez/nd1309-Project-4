/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.height = -1;
    this.timeStamp = '';
    this.body = data;
    this.previousBlockHash = '';
    this.hash = '';
  }
}

module.exports = Block;
