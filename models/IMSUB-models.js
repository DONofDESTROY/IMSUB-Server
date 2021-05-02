const mongoose = require("mongoose");
// function phoneValidator(no){
//   return val ==  /\d{10}/.test(v);
// }
const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Please give a client name"],
    trim: true,
    maxlength: [10, "Name cannot be more than 10 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Add a description for the invoice"],
  },
  clientEmail: {
    type: String,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid email",
    ],
  },
  phone: {
    type: Number,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: "Please enter a 10 digit mobile number",
    },
  },
  totalAmout: {
    type: Number,
    min: [1, "Amount cannot be less than 1rs"],
  },
  totalGST: {
    type: Number,
    min: [1, "Total Gst cannot be less than 1%"],
  },
  items: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Invoices", InvoiceSchema);
