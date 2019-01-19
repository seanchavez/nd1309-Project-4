const Blockchain = require('./BlockChain.js');
const express = require('express');
const app = express();
const port = 8000;

const bc = new Blockchain();

app.get('/', (req, res) => res.status(200).json({ body: 'Sanity Check' }));

app.get('/block/:height', async (req, res) => {
  try {
    const block = await bc.getBlock(req.params.height);
    console.log('Block: ', block);
    if (block) {
      res.status(200).json(block);
    } else {
      res.status(404).json({ error: 'Block not found' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => console.log(`Running on ${port}`));
