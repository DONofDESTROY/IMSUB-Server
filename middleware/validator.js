const { AuditLogBlockchain } = require('../utils/chain')
// middle ware that validates blockchain
const validator = async (res, req, next) => {
    let blockChain = new AuditLogBlockchain()
    let status = await blockChain.checkChainValidity();
    console.log(`Chain Status ${(status) ? 'SUCCESS' : 'FAILED'}`.red.bold)
    next()
}

module.exports = validator