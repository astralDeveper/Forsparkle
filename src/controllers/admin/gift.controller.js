const Gift = require("../../models/Gift.js");
const { cloudinary } = require("../../utlis/fileUploder.js");

const CreateGift = async (req, res) => {
  try {
    let { diamonds, name } = req.body;
    let image = req.file;
    if (!diamonds || !image || !name) {
      return res.status(400).json({ message: "Bad request! All fields are required", status: false })
    }

    let gift = await Gift.create({ ...req.body, image });

    return res.status(201).json({ message: "Gift created successfully", gift, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const UpdateGift = async (req, res) => {
  try {
    let { id } = req.params;
    let { diamonds } = req.body;
    let image = req.file;
    let gift = await Gift.findById(id);

    if (!diamonds && !image) {
      return res.status(400).json({ message: "Bad request! All fields are required", status: false })
    }

    if (image) {
      await cloudinary.api.delete_resources([gift.image.filename], {
        resource_type: gift?.image?.mimetype?.split("/")[0] ?? "image",
        type: "upload",
      });
      await Gift.findByIdAndUpdate(id, { image });
    }


    if (diamonds) {
      await Gift.findByIdAndUpdate(id, req.body, { new: true });
    }

    let updatedGift = await Gift.findById(id);


    return res.status(201).json({ message: "Gift updated successfully", gift: updatedGift, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const GetGift = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bad request! Id is required", status: false })
    }

    let gift = await Gift.findById(id);

    return res.status(201).json({ gift, status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
}

const DeleteGift = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Bad request! Id is required", status: false })
    }

    let gift = await Gift.findById(id);

    await cloudinary.api.delete_resources([gift.image.filename], {
      resource_type: gift?.image?.mimetype?.split("/")[0] ?? "image",
      type: "upload",
    });

    await Gift.findByIdAndDelete(id);

    return res.status(201).json({ message: "Gift deleted successfully", status: true })

  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false })
  }
};


module.exports = {
  CreateGift,
  UpdateGift,
  GetGift,
  DeleteGift,
}