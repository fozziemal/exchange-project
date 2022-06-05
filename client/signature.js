const secp = require('@noble/secp256k1');
const { keccak_256 } = require('@noble/hashes/sha3');

// insert private key of sender here
const priv = '5938737c724aa246e12c5e8edd994cd1bf3764109f6406cb3ace012d8e075365';

// same message used to verify by server
const msg = 'I would like to transfer these tokens!';

// obtain and log digital signature for input into client
(async () => {
  let signed = await secp.sign(keccak_256(msg), priv);
  signed = Buffer.from(signed).toString('hex')
  console.log('signature', signed);
})()