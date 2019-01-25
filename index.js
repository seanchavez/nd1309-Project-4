const Blockchain = require('./BlockChain');
const Block = require('./Block');
const express = require('express');
const bp = require('body-parser');
const app = express();
const port = 8000;

app.use(bp.json());

const bc = new Blockchain();

app.get('/', (req, res) => res.status(200).json({ body: 'Sanity Check' }));

app.post('/requestValidation', (req, res) => {
  try {
    const address = req.body.address;
    if (bc.mempool[address]) {
      bc.mempool[address].validationWindow =
        (Date.now() - bc.mempool[address].requestTimeStamp) / 1000;
      res.status(200).json(bc.mempool[address]);
    }
    const timestamp = Date.now();
    const response = {
      walletAddress: address,
      requestTimeStamp: timestamp,
      message: `${address}:${timestamp}:starRegistry`,
      validationWindow: 300,
    };
    bc.mempool[address] = response;
    res.status(200).json(response);

    const validationRequestTimer = setTimeout(() => {
      delete bc.mempool[address];
    }, 1000 * 60 * 5);
    bc.mempool[address].timeoutID = validationRequestTimer();
    console.log('ResponseWhat: ', bc.mempool[address].timeoutID);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/block/:height', async (req, res) => {
  try {
    const block = await bc.getBlock(req.params.height);
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
  try {
    const blockBody = req.body.body;
    if (!blockBody) {
      res.status(400).json({ error: 'Block body can not be empty' });
    }
    const block = JSON.parse(await bc.addBlock(new Block(blockBody)));
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
