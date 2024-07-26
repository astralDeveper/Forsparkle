const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema(
  {
    diamonds: { type: Number },
    name: { type: String },
    image: {
      path: { type: String },
      filename: { type: String },
      mimetype: { type: String }
    },
    discount: { type: Number }
  },
  {
    timestamps: true,
  }
);

const Gift = mongoose.model("Gift", GiftSchema);
module.exports = Gift;
