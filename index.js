const Blockchain = require('./BlockChain.js');
const Block = require('./Block.js');
const express = require('express');
const bp = require('body-parser');
const app = express();
const port = 8000;

app.use(bp.json());

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

app.post('/block', async (req, res) => {
  console.log('Body: ', req.body);
  try {
    if (!req.body.body) {
      res.status(400).json({ error: 'Block body can not be empty' });
    }
    const block = await bc.addBlock(new Block(req.body.body));
    console.log('Block: ', block);
    if (block) {
      res.status(201).json(block);
    } else {
      res.status(400).json({ error: 'Block could not be added' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => console.log(`Running on ${port}`));
