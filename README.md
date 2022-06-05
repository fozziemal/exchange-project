# exchange-project
Crypto token exchange that utilizes ECDSA cryptography to send tokens via signatures and verifications to ensure valid transfers.

Accounts are initialized with private/public keys and with different amounts of ETH. These values are output to console.

Users utilize the interface and type in their public address to see balance and can transfer funds to another account.

In transferring, a user can use the signature.js script to produce a digital signature that must be verified by the server
before the transfer is allowed.
