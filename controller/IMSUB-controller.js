const Invoices = require('../models/IMSUB-models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc         get all invoices
 * @route        GET /api/v1/operations/invoices
 * @access       Protected
 */

exports.getInvoices = asyncHandler(async (req, res, next) => {
  // get the user
  const userId = req.user.id;
  // Return only those invoice owned by that user
  const invoices = await Invoices.find({ user: userId });
  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});

/**
 * @desc         get single invoice
 * @route        GET /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.getSingleInvoice = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const invoice = await Invoices.findById(req.params.id);
  const invoiceUserId = invoice.user.toString();

  console.log(userId, 'this is type of ', typeof userId);
  console.log(invoiceUserId, 'this is type of ', typeof invoiceUserId);
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  } else if (invoiceUserId !== userId) {
    // Check if the invoice is owned by the user
    return next(
      new ErrorResponse(
        `You don't have permission to view invoice ${req.params.id}`,
        401
      )
    );
  }
  res.status(200).json({ success: true, data: invoice });
});

/**
 * @desc   	    Create new Invoice
 * @route 		POST /api/v1/operations/
 * @access 		Protected
 */

exports.createInvoice = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const invoices = await Invoices.create(req.body);
  res.status(200).json({
    success: true,
    data: invoices,
  });
});

/**
 * @desc         Update Invoice
 * @route        PUT /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.updateInvoices = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const invoice = await Invoices.findById(req.params.id);
  const invoiceUserId = invoice.user.toString();
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  } else if (invoiceUserId !== userId) {
    // Check if the invoice is owned by the user
    return next(
      new ErrorResponse(
        `You don't have permission to modify invoice ${req.params.id}`,
        401
      )
    );
  }

  const updateInvoice = await Invoices.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, message: 'updated successfylly' });
});

/**
 * @desc         Delete Invoice
 * @route        DELETE /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.deleteInvoice = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const invoice = await Invoices.findById(req.params.id);
  const invoiceUserId = invoice.user.toString();
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  } else if (invoiceUserId !== userId) {
    // Check if the invoice is owned by the user
    return next(
      new ErrorResponse(
        `You don't have permission to Delete invoice ${req.params.id}`,
        401
      )
    );
  }
  const deleteInvoice = await Invoices.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Deleted successfylly' });
  if (!invoice) {
    return next(
      new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404)
    );
  }
});
