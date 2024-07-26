const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    diamonds: { type: Number },
    price: { type: Number },
    discount: { type: Number }
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
