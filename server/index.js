const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('@noble/secp256k1');
const { keccak_256 } = require('@noble/hashes/sha3');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// initialize private and public keys array for storing 
const privateKeys = [3];
const publicKeys = [3];

// populate above arrays with random keys
for (let i = 0; i < 3; i++) {
  
  privateKeys[i] = secp.utils.randomPrivateKey();
  privateKeys[i] = Buffer.from(privateKeys[i]).toString('hex');
  
  publicKeys[i] = secp.getPublicKey(privateKeys[i]);
  publicKeys[i] = Buffer.from(publicKeys[i]).toString('hex');
  publicKeys[i] = '0x' + publicKeys[i].slice(publicKeys[i].length - 40);

}

// initialize balances associated with each public key
const balances = {
  [publicKeys[0]]: 100,
  [publicKeys[1]]: 50,
  [publicKeys[2]]: 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, signature} = req.body;

  // identify index of sender within privateKeys array
  // reconstruct public key based on private key
  let pubIdx;
  for (pubIdx = 0; pubIdx < publicKeys.length; pubIdx++) {
    if (publicKeys[pubIdx] == sender) {
      break;
    }
  }
  const pub = secp.getPublicKey(privateKeys[pubIdx]);

  // same message signed by sender in signature.js
  const msg = 'I would like to transfer these tokens!';
  let msgHash = keccak_256(msg);

  const verification = secp.verify(signature, msgHash, pub);

  if (verification) {
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
    console.log('Transfer successful!');
  }
  else {
    console.log('Signature verification has failed!');
  }
});

app.listen(port, () => {
  
  // display public keys and associated balances
  console.log('Available Accounts:');
  for (let i = 0; i < publicKeys.length; i++) {

    console.log(`Account ${i}: ` + publicKeys[i] + ' ' + `(${balances[publicKeys[i]]} ETH)`);

  }
  
  // display associated private keys
  console.log('\n' + 'Private Keys:');
  for (let i = 0; i < privateKeys.length; i++) {

    console.log(`Account ${i}: ` + privateKeys[i]);

  }

  console.log(`Listening on port ${port}!`);
});
