/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = '';
    this.height = -1;
    this.time = '';
    this.body = data;
    this.previousBlockHash = '';
  }
}

module.exports = Block;
