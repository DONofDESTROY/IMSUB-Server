// https://www.linkedin.com/pulse/implementation-simple-blockchain-using-nodejs-mongodb-sougata-pal
// code is grabbed from here
const crypto = require('crypto-js');
const mongoose = require('mongoose');
const BlockChain = require('../models/IMSUB-Block');

class Block {
  constructor(id, data, timeStamp, previousHash = 'N/A') {
    this.id = id;
    this.data = data;
    this.timeStamp = timeStamp;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
    this.iterations = 0;
  }

  computeHash() {
    return crypto
      .SHA512(
        this.id +
          this.previousHash +
          this.timeStamp +
          this.data +
          this.iterations
      )
      .toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.iterations++;
      this.hash = this.computeHash();
    }
  }
}

exports.AuditLogBlockchain = class AuditLogBlockchain {
  constructor() {
    this.difficulty = 3;
  }

  async initialize() {
    let genesisBlockInfo = await this.getGenesisBlock();
    if (!genesisBlockInfo) {
      console.log('Initializing Genesis block . . .');
      let genesisBlockInfo = await this.createGenesisBlock();
      console.log(`Genesis block: ${genesisBlockInfo.id}`);
    } else {
      console.log(`Existing Genesis block: ${genesisBlockInfo.id}`);
    }
  }

  async createGenesisBlock() {
    let id = new mongoose.Types.ObjectId().toHexString();
    let newblockInfo = new Block(id, null, new Date().getTime());
    return await this.addNewBlock(newblockInfo);
  }

  async createTransaction(payload) {
    let previousHash = await this.getPrecedingBlock();
    console.log(previousHash.hash);
    if (previousHash) {
      let id = new mongoose.Types.ObjectId().toHexString();
      let currentBlockInfo = new Block(
        id,
        payload,
        new Date().getTime(),
        previousHash.hash
      );
      return await this.addNewBlock(currentBlockInfo);
    }
    return false;
  }

  async addNewBlock(blockObj) {
    blockObj.proofOfWork(this.difficulty);
    return this.addBlockToChain(blockObj);
  }

  async addBlockToChain(blockInfo) {
    // save new block to chain
    let chainInfo = BlockChain();
    chainInfo._id = blockInfo.id;
    chainInfo.previousHash = blockInfo.previousHash;
    chainInfo.data = blockInfo.data;
    chainInfo.hash = blockInfo.hash;
    chainInfo.iterations = blockInfo.iterations;
    chainInfo.timeStamp = blockInfo.timeStamp;
    let chainEntry = await chainInfo.save();
    return chainEntry;
  }

  async getGenesisBlock() {
    let blockInfo = await BlockChain.find().sort({ $natural: 1 }).limit(1);
    return blockInfo.length > 0 ? blockInfo[0] : null;
  }

  async getPrecedingBlock() {
    let blockInfo = await BlockChain.find().sort({ $natural: -1 }).limit(1);
    return blockInfo.length > 0 ? blockInfo[0] : null;
  }

  async checkChainValidity() {
    let promise = new Promise(resolve => {
      let previousBlock = null;
      let currentBlock = null;
      let idx = 1;
      BlockChain.find({})
        .sort({ $natural: 1 })
        .cursor()
        .on('data', entry => {
          console.log(`Validating Block(${idx}): ${entry.id}`);
          if (previousBlock) {
            // recreate the block with the info from database
            currentBlock = new Block(
              entry.id,
              entry.data,
              entry.timeStamp,
              entry.previousHash
            );
            currentBlock.proofOfWork(this.difficulty);

            // validate computed block hash with database hash entry
            if (entry.hash !== currentBlock.hash) {
              console.log(
                `Stored hash(${entry.hash}) and computed hash(${currentBlock.hash}) doesn't match`
              );
              process.exit(0);
            } else {
              console.log(
                `Block Computed Hash Validated: ${currentBlock.id} -> SUCCESS`
              );
            }

            // validate chain block with preceding hash
            if (currentBlock.previousHash !== previousBlock.hash) {
              console.log(
                `Previous block hash(${previousBlock.hash}) and preceding block hash(${currentBlock.previousHash}) doesn't match`
              );
              process.exit(0);
            } else {
              console.log(
                `Block Preceding Hash Chain Validated: ${currentBlock.id} -> SUCCESS`
              );
            }

            // assign current block as previous block for the next cycle
            previousBlock = Object.assign({}, currentBlock);
            idx++;
          } else {
            console.log(`Genesis Block(${idx}): ${entry.id}`);
            previousBlock = new Block(
              entry.id,
              entry.data,
              entry.timeStamp,
              entry.previousHash
            );
            previousBlock.proofOfWork(this.difficulty);
            idx++;
          }
        })
        .on('end', function () {
          resolve(true);
        });
    });

    return promise;
  }
};
