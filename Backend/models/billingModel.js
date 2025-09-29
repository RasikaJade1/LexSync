const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quotationAmount: Number,
    invoiceAmount: Number,
    status: {
      type: String,
      enum: ["quotation", "invoice", "paid", "unpaid"],
      default: "quotation",
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Billing", billingSchema);
