const mongoose = require('mongoose');
const BlockChainSchema = new mongoose.Schema({
  timeStamp:{
    type: Number
  },
  data:
  {
    type: mongoose.Schema.Types.Mixed,
  },
  previousHash: {
    type: String,
  },
  hash: {
    type: String,
  },
  iterations: {
    type: Number,
  },

},
  {
    collection: 'block_chain',
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

BlockChainSchema.virtual('id').get(function () {
  return String(this._id)
})

module.exports = mongoose.model('BlockChain', BlockChainSchema);