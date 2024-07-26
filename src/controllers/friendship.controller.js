const configurations = require("../../configurations.js");
const User = require("../models/User.js");

const getSuggestions = async (req, res) => {
  try {

    let user = req.user;


    const genderFilter = req.query.gender;

    let query = { _id: { $ne: user._id }, role: { $ne: configurations.role.super_admin || configurations.role.admin } };

    if (genderFilter) {
      if (genderFilter === 'boys') {
        query.gender = 'male';
      } else if (genderFilter === 'girls') {
        query.gender = 'female';
      }
    }
    let suggestions = await User.find(query).select(['name', 'username', '_id', 'image', 'birthday', 'gender', 'role']);

    return res.status(200).json({ suggestions, status: true });

  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false })
  }
};

module.exports = { getSuggestions };