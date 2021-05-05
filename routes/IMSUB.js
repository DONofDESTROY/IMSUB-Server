const express = require('express');
const {
  getInvoices,
  getSingleInvoice,
  createInvoice,
  updateInvoices,
  deleteInvoice,
} = require('../controller/IMSUB-controller');
const router = express.Router();

router.route('/invoices').get(getInvoices);
router.route('/invoice/:id').get(getSingleInvoice);
router.route('/').post(createInvoice);
router.route('/:id').put(updateInvoices);
router.route('/:id').delete(deleteInvoice);

module.exports = router;
