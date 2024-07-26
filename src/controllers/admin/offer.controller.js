const Offer = require("../../models/Offer.js");

const CreateOffer = async (req, res) => {
  try {
    let { price, diamonds } = req.body;

    if (!price || !diamonds) {
      return res.status(400).json({ message: "Bad request! All fields are required", status: false })
    }

    let offer = await Offer.create({ ...req.body });

    return res.status(201).json({ message: "Offer created successfully", offer, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const UpdateOffer = async (req, res) => {
  try {
    let { id } = req.params;
    let { price, diamonds } = req.body;

    if (!price || !diamonds) {
      return res.status(400).json({ message: "Bad request! All fields are required", status: false })
    }

    let offer = await Offer.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(201).json({ message: "Offer updated successfully", offer, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const GetOffer = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bad request! Id is required", status: false })
    }

    let offer = await Offer.findById(id);

    return res.status(201).json({offer, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const DeleteOffer = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bad request! Id is required", status: false })
    }

    await Offer.findByIdAndDelete(id);

    return res.status(201).json({ message: "Offer deleted successfully", status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
};


module.exports = {
  CreateOffer,
  UpdateOffer,
  GetOffer,
  DeleteOffer,
}