const Invoices = require('../models/IMSUB-models');

/**
 * @des          login
 * @route        POST	/api/v1/operations/login/:id
 * @access       Public
 */

exports.loginIMSUB = (req, res, next) => {
  res.status(200).json({ username: 'user' });
};

/**
 * @des          register
 * @route        POST /api/v1/operations/register/:id
 * @access       Public
 */

exports.registerIMSUB = (req, res, next) => {
  res.status(200).json({ success: `Successfully registered ${req.params.id}` });
};

/**
 * @des          get invoices
 * @route        GET /api/v1/operations/invoices
 * @access       Protected
 */

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoices.find();

    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @des          get single invoice
 * @route        GET /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.getSingleInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoices.findById(req.params.id);
    if (!invoice) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @des    	    Create new Invoice
 * @route 		POST /api/v1/operations/invoice
 * @access 		Protected
 */

exports.createInvoice = async (req, res, next) => {
  try {
    const invoices = await Invoices.create(req.body);
    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @des          Update Invoice
 * @route        PUT /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.updateInvoices = async (req, res, next) => {
  try {
    const invoice = await Invoices.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ msg: 'updated successfylly' });
    if (!invoice) {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @des          Delete Invoice
 * @route        DELETE /api/v1/operations/invoice/:id
 * @access       Protected
 */

exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoices.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Deleted successfylly' });
    if (!invoice) {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
