const Blockchain = require('./BlockChain.js');
const express = require('express');
const app = express();
const port = 8000;

const bc = new Blockchain();

app.get('/', (req, res) => res.status(200).json({ body: 'Sanity Check' }));

app.get('/block/:height', (req, res) => {
  bc.getBlock(req.params.height)
    .then(block => {
      console.log('Block: ', block);
      if (block) {
        res.status(200).json(block);
      } else {
        res.status(404).json({ error: 'Block not found' });
      }
    })
    .catch(err => {
      res.status(500).send({ error: err });
    });
});

app.listen(port, () => console.log(`Running on ${port}`));
