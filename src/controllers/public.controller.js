const Gift = require("../models/Gift.js");
const Offer = require("../models/Offer.js");
const Story = require("../models/Story.js");

const GetOffers = async (req, res) => {
  try {
    let offers = await Offer.find({});
    return res.status(200).json({ offers });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
}

const GetOfferById = async (req, res) => {
  try {
    let { id } = req.params
    if (!id) {
      return res.status(400).json({ message: "id is required", status: false });
    }
    let offer = await Offer.findById(id);
    return res.status(200).json({ offer, status: true });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

const GetGifts = async (req, res) => {
  try {
    let gifts = await Gift.find({});
    return res.status(200).json({ gifts });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
}

const GetGiftById = async (req, res) => {
  try {
    let { id } = req.params
    if (!id) {
      return res.status(400).json({ message: "id is required", status: false });
    }
    let gift = await Gift.findById(id);
    return res.status(200).json({ gift, status: true });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

const GetStories = async (req, res) => {
  try {
    let stories = await Story.find({}).populate({ path: "author", select: "name displayName realName _id gender image" }).sort({ views: -1 }).exec();
    return res.status(200).json({ stories, status: true });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

const GetStory = async (req, res) => {
  try {
    let { id } = req.params
    let story = await Story.findById(id).populate({ path: "author", select: "name displayName realName _id gender image" });
    return res.status(200).json({ story, status: true });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

const AddStoryView = async (req, res) => {
  try {
    let { id } = req.params;
    let user = req.user;
    await Story.findByIdAndUpdate(id, { $addToSet: { views: user._id } });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

module.exports = {
  GetOffers,
  GetOfferById,
  GetGifts,
  GetGiftById,
  GetStories,
  GetStory,
  AddStoryView,
}