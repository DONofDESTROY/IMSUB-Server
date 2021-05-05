const express = require('express');
const {
  getInvoices,
  getSingleInvoice,
  createInvoice,
  updateInvoices,
  deleteInvoice,
} = require('../controller/IMSUB-controller');
const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/invoices').get(protect, getInvoices);
router.route('/invoice/:id').get(protect, getSingleInvoice);
router.route('/').post(protect, createInvoice);
router.route('/:id').put(protect, updateInvoices);
router.route('/:id').delete(protect, deleteInvoice);

module.exports = router;
