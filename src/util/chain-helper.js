const EC = require('elliptic').ec;
// SEC : Standards for Efficient Cryptography
// P : prime 
// 256: 256 bits
// K : Some old guy's name
// 1 : version(first one)
const ec = new EC('secp256k1');
const uuid = require("uuid/v1")
const SHA256 = require('crypto-js/sha256');

exports.genKeyPair = () => ec.genKeyPair();

exports.id = () => uuid();

exports.hash = (data) => {
  return SHA256(JSON.stringify(data)).toString();
}

exports.verifySignature = (publicKey, signature, dataHash) => {
  return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
}