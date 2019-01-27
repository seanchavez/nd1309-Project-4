const Blockchain = require('./BlockChain');
const Block = require('./Block');
const express = require('express');
const bp = require('body-parser');
const bitcoinMessage = require('bitcoinjs-message');
const app = express();
const port = 8000;

app.use(bp.json());

const bc = new Blockchain();

app.get('/', (req, res) => res.status(200).json({ body: 'Sanity Check' }));

app.get('/stars/hash ::hash', async (req, res) => {
  try {
    const star = await bc.getBlockByHash(req.params.hash);
    if (star) {
      res.status(200).json(star);
    } else {
      res.status(404).json({ error: 'No star found with that hash' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/stars/address::address', async (req, res) => {
  try {
    const stars = await bc.getBlocksWithSameAddress(req.params.address);
    if (stars) {
      res.status(200).json(stars);
    } else {
      res.status(404).json({ error: 'No stars found with that address' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/message-signature/validate', (req, res) => {
  try {
    const { address, signature } = req.body;
    console.log('BEFORE');
    if (bc.mempool[address].registerStar) {
      console.log('AFTER');
      bc.mempool[address].status.submissionWindow = Math.round(
        (bc.mempool[address].status.validationTimeStamp -
          (Date.now() - 30 * 60 * 1000)) /
          1000,
      );
      res
        .status(200)
        .json({ registerStar: true, ...bc.mempool[address].status });
    } else if (bc.mempool[address]) {
      const message = bc.mempool[address].response.message;
      const isValid = bitcoinMessage.verify(message, address, signature);
      console.log('IsValid: ', isValid);
      if (isValid) {
        clearTimeout(bc.mempool[address].timeoutID);
        const timestamp = Date.now();
        const response = {
          registerStar: true,
          status: {
            address,
            validationTimeStamp: timestamp,
            message,
            submissionWindow: 1800,
            messageSignature: true,
          },
        };
        console.log('WTF: ', response);
        res.status(201).json(response);
        bc.mempool[address] = { ...response };
        bc.mempool[address].timeoutID = setTimeout(() => {
          delete bc.mempool[address];
          console.log('30 min Timeout!');
        }, 1000 * 60 * 30);
        console.log('WHATUP: ', bc.mempool[address]);
      } else {
        res.status(400).json({ error: 'A valid signature is required' });
      }
    } else {
      res
        .status(400)
        .json({ error: 'You need to submit a validation request' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/requestValidation', (req, res) => {
  try {
    const address = req.body.address;

    if (bc.mempool[address]) {
      bc.mempool[address].response.validationWindow = Math.round(
        (bc.mempool[address].response.requestTimeStamp -
          (Date.now() - 5 * 60 * 1000)) /
          1000,
      );
      console.log('IDK: ', bc.mempool[address]);
      res.status(200).json(bc.mempool[address].response);
    } else {
      const timestamp = Date.now();
      const response = {
        walletAddress: address,
        requestTimeStamp: timestamp,
        message: `${address}:${timestamp}:starRegistry`,
        validationWindow: 300,
      };

      res.status(201).json(response);

      bc.mempool[address] = { response };
      bc.mempool[address].timeoutID = setTimeout(() => {
        delete bc.mempool[address];
        console.log('5 min Timeout!');
      }, 1000 * 60 * 5);

      console.log('ResponseWhat: ', bc.mempool[address]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/block/:height', async (req, res) => {
  try {
    const block = await bc.getBlock(req.params.height);
    if (block) {
      res.status(200).json(block);
    } else {
      res.status(404).json({ error: 'Star not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/block', async (req, res) => {
  try {
    const blockBody = req.body;
    if (!bc.mempool[blockBody.address].registerStar) {
      res.status(400).json({ error: 'You must first validate this request' });
    } else if (!blockBody.star) {
      res.status(400).json({ error: 'Add star data' });
    } else {
      blockBody.star.story = Buffer(blockBody.star.story).toString('hex');
      const block = JSON.parse(await bc.addBlock(new Block(blockBody)));
      if (block) {
        res.status(201).json(block);
      } else {
        res.status(400).json({ error: 'Block could not be added' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => console.log(`Running on ${port}`));
