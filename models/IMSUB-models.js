const mongoose = require('mongoose');
const slugify = require('slugify');

const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please give a client name'],
    trim: true,
    maxlenght: [10, 'Name cannot be more than 10 characters'],
  },
  slug: String,
  customerGST: {
    type: String,
    required: [true, 'Please give gst of customer'],
  },
  description: {
    type: String,
    // required: [true, 'Add a description for the invoice'],
  },
  /* clientEmail: {
    type: String,
    // unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter valid email',
    ],
  }, */
  phone: {
    type: String,
    // unique: true,
    maxlength: [20, 'Phone number cannot be longet than 20 characters'],
  },
  totalAmout: {
    type: Number,
    min: [1, 'Amount cannot be less than 1rs'],
  },
  totalGST: {
    type: Number,
    min: [1, 'Total Gst cannot be less than 1%'],
  },
  /* items: {
    type: [String],
    required: true,
  }, */
  items: [
    {
      gst: Number,
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      rate: Number,
    },
  ],
  paymentStatus: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create invoice slug from the name
InvoiceSchema.pre('save', function (next) {
  this.slug = slugify(this.customerName, { lower: true });
  next();
});

module.exports = mongoose.model('Invoices', InvoiceSchema);
