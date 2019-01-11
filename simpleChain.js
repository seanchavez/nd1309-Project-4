/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/
// const level = require('level');
// const chainDB = './chaindata';

// db = level(chainDB);

const Blockchain = require('./BlockChain.js');
const Block = require('./Block.js');

const myBlockChain = new Blockchain();

// db.createReadStream()
//   .on('data', function(data) {
//     console.log(data.key, '=', data.value);
//   })
//   .on('error', function(err) {
//     console.log('Oh my!', err);
//   })
//   .on('close', function() {
//     console.log('Stream closed');
//   })
//   .on('end', function() {
//     console.log('Stream ended');
//   });

// setTimeout(function() {
//   console.log('Waiting...');
// }, 10000);

/******************************************
 ** Function for Create Tests Blocks   ****
 ******************************************/

// (function theLoop(i) {
//   setTimeout(function() {
//     let blockTest = new Block('Test Block - ' + (i + 1));
//     // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
//     myBlockChain.addBlock(blockTest).then(result => {
//       console.log(result);
//       i++;
//       if (i < 10) theLoop(i);
//     });
//   }, 1000);
// })(0);

//console.log(myBlockChain);

// myBlockChain.getBlock(0).then(block => {
//   parsedBlock = JSON.parse(block);
//   console.log(parsedBlock.data);
// });

// .addBlock(new Block('First block in the chain - Genesis block'))
//   .then(response => {
//     console.log('RES: ', response);
//   });
// myBlockChain.getBlock(0).then(block => {
//   console.log(block.data);
// });
//console.log('Genesis: ', myBlockChain.getBlock(0));
//console.log('WTF', myBlockChain);

/***********************************************
 ** Function to get the Height of the Chain ****
 ***********************************************/

//Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
// myBlockChain
//   .getBlockHeight()
//   .then(height => {
//     console.log(height);
//   })
//   .catch(err => {
//     console.log(err);
//   });

/***********************************************
 ******** Function to Get a Block  *************
 ***********************************************/

// Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
myBlockChain;
// .getBlock(0)
// .then(block => {
//   //console.log(JSON.stringify(block));
//   console.log(block);
// })
// .catch(err => {
//   console.log(err);
// });

/***********************************************
 ***************** Validate Block  *************
 ***********************************************/

// Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
// myBlockChain
//   .validateBlock(0)
//   .then(valid => {
//     console.log(valid);
//   })
//   .catch(error => {
//     console.log(error);
//   });

/** Tampering a Block this is only for the purpose of testing the validation methods */

// myBlockChain
//   .getBlock(5)
//   .then(block => {
//     let blockAux = block;
//     blockAux.body = 'Tampered Block';
//     myBlockChain
//       ._modifyBlock(blockAux.height, blockAux)
//       .then(blockModified => {
//         if (blockModified) {
//           myBlockChain
//             .validateBlock(blockAux.height)
//             .then(valid => {
//               console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
//             })
//             .catch(error => {
//               console.log(error);
//             });
//         } else {
//           console.log("The Block wasn't modified");
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

// myBlockChain
//   .getBlock(6)
//   .then(block => {
//     let blockAux = block;
//     blockAux.previousBlockHash = 'jndininuud94j9i3j49dij9ijij39idj9oi';
//     myBlockChain
//       ._modifyBlock(blockAux.height, blockAux)
//       .then(blockModified => {
//         if (blockModified) {
//           console.log('The Block was modified');
//         } else {
//           console.log("The Block wasn't modified");
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

/***********************************************
 ***************** Validate Chain  *************
 ***********************************************/

// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
myBlockChain
  .validateChain()
  .then(errorLog => {
    if (errorLog.length > 0) {
      console.log('The chain is not valid:');
      errorLog.forEach(error => {
        console.log(error);
      });
    } else {
      console.log('No errors found, The chain is Valid!');
    }
  })
  .catch(error => {
    console.log(error);
  });
