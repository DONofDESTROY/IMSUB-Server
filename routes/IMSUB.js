const express = require('express');
const {
  loginIMSUB,
  registerIMSUB,
  getInvoices,
  getSingleInvoice,
  createInvoice,
  updateInvoices,
  deleteInvoice,
} = require('../controller/IMSUB-controller');
const router = express.Router();

router.route('/login/:id').post(loginIMSUB);
router.route('/register/:id').post(registerIMSUB);
router.route('/invoices').get(getInvoices);
router.route('/invoice/:id').get(getSingleInvoice);
router.route('/').post(createInvoice);
router.route('/:id').put(updateInvoices);
router.route('/:id').delete(deleteInvoice);

module.exports = router;
