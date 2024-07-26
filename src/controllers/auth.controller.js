const User = require("../models/User.js");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const configurations = require("../../configurations.js");
const { cloudinary } = require("../utlis/fileUploder.js");
const Story = require("../models/Story.js");

const Login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email?.trim()?.length || !password?.trim()?.length) {
      return res
        .status(400)
        .json({ message: "Bad request! all fields are required." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email! ." });
    }

    if (user.isBlocked) {
      return res.status(404).json({
        message: `${user?.email}: Your account has been suspend, You can't login, Please contact customer care.`,
      });
    }

    let matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(404)
        .json({ message: "Incorrect email or password! ." });
    }

    let userData = await User.findById(user._id).select(["-password"]);

    let token = JWT.sign({ _id: user._id }, configurations.jwt_secret);

    return res
      .status(200)
      .json({ message: "Login successfull.", user: userData, token });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};
function generateRandomIntegerWithLength(length) {
  if (length <= 0) return null;

  const min = Math.pow(10, length - 1); // Smallest number with the given length
  const max = Math.pow(10, length) - 1; // Largest number with the given length

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const SignUp = async (req, res) => {
  try {
    let { email, password, gender, birthday } = req.body;
    if (
      !email?.trim()?.length ||
      !password?.trim()?.length ||
      !gender?.trim()?.length ||
      !birthday?.trim()?.length
    ) {
      return res
        .status(400)
        .json({ message: "Bad request! all fields are required." });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists with this email! ." });
    }

    let hash = await bcrypt.hash(password, 12);

    let obj = {
      name: 'guest' + generateRandomIntegerWithLength(7),
      tagline: '',
      picture: null,
      balance: 0.00,
    }

    let newUser = await User.create({
      email,
      password: hash,
      gender,
      birthday,
      ...obj
    });

    let token = JWT.sign({ _id: newUser._id }, configurations.jwt_secret);

    return res
      .status(200)
      .json({ message: "Sign Up successfull.", user: newUser, token });
  } catch (error) {
    return res.status(500).json({ msg: error?.message, status: false });
  }
};

const CreateProfile = async (req, res) => {
  try {
    let { displayName, realName, language, gender, age } = req.body;
    if (
      !displayName?.trim()?.length ||
      !realName?.trim()?.length ||
      !language?.trim()?.length ||
      !gender?.trim()?.length ||
      !age?.trim()?.length
    ) {
      return res
        .status(400)
        .json({ message: "Bad request! all fields are required." });
    }

    let user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, image: { ...req.file } },
      { new: true }
    ).select(["-password"]);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const AddInterests = async (req, res) => {
  try {
    let { interests } = req.body;
    let auth = req.user;
    let user = await User.findByIdAndUpdate(
      auth._id,
      { interests },
      { new: true }
    );

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    let file = req?.file;
    let user = req.user;
    let data = req.body;

    if (file) {
      await cloudinary.api.delete_resources([user.image.filename], {
        resource_type: user?.image?.mimetype?.split("/")[0] ?? "image",
        type: "upload",
      });
      await User.findByIdAndUpdate(user._id, { image: file });
    }

    let updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
    });

    return res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfuly.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const AddStory = async (req, res) => {
  try {
    let auth = req.user;
    let media = req.file;
    let { title, caption } = req.body;

    let story = await Story.create({
      author: auth._id,
      media,
      title: title ?? "",
      caption: caption ?? "",
    });

    let user = await User.findByIdAndUpdate(
      auth._id,
      { stories: story._id },
      { new: true }
    ).populate({ path: "stories" });

    return res.status(200).json({
      message: "Story has been added successfuly.",
      status: true,
      stories: user.stories,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.messsage, status: false });
  }
};

const GetStories = async (req, res) => {
  try {
    let auth = req.user;
    let user = await User.findById(auth._id).populate({ path: "stories" });
    return res.status(200).json({ stories: user.stories, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

// const GetStoryWithoutId = async (req, res) => {
//   try {

//     let story = await Story.find().populate({
//       path: "author",
//       select: "name displayName gender _id image",
//     });
//     return res.status(200).json({ story, status: true });
//   } catch (error) {
//     return res.status(500).json({ message: error?.message, status: false });
//   }
// };
const getAllStories = async (req, res) => {
  try {
    let stories = await Story.find().populate({
      path: "author",
      select: "name displayName gender _id image",
    });
    return res.status(200).json({ stories, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};
const GetStoryById = async (req, res) => {
  try {
    let { id } = req.params;
    let story = await Story.findById(id).populate({
      path: "author",
      select: "name displayName gender _id image",
    });
    return res.status(200).json({ story, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const DeleteStory = async (req, res) => {
  try {
    let { id } = req.params;
    let auth = req.user;
    let story = await Story.findOne({ _id: id, author: auth._id });

    await cloudinary.api.delete_resources([story.media.filename], {
      resource_type: story?.media?.mimetype?.split("/")[0] ?? "video",
      type: "upload",
    });

    await Story.findByIdAndDelete(id);

    let user = await User.findById(auth._id);

    user.stories = user.stories.filter((s) => s._id.toString() !== id);
    await user.save();

    return res.status(200).json({ stories: user.stories, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const GetProfile = async (req, res) => {
  try {
    let auth = req.user;
    let user = await User.findById(auth._id).select(["-password"]);
    return res.status(200).json({ user, status: false });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const profileDetails = async (req, res) => {
  try {
    let auth = req.user;
    let user = await User.findById(auth._id).select(["-password"]);
    return res.status(200).json({ user, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const UpdateUserProfile = async (req, res) => {
  try {
    let file = req?.file;
    let user = req.user;
    let data = req.body;

    if (file) {
      await cloudinary.api.delete_resources([user.image.filename], {
        resource_type: user?.image?.mimetype?.split("/")[0] ?? "image",
        type: "upload",
      });
      await User.findByIdAndUpdate(user._id, { image: file });
    }

    let updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
    });

    return res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfuly.",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};



// Parveen App Controllers

const CreateUser = async (req, res) => {
  try {
    let { emailAddress } = req.body;

    if (!emailAddress?.trim()?.length) {
      return res
        .status(400)
        .json({ message: "Bad request! Email address is required." });
    }

    let user = await User.findOne({ email: emailAddress });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }
    let date = new Date();
    let a = date.getHours().toString();
    let b = date.getMinutes().toString();
    let newUser = await User.create({
      ...req.body,
      streaks: {
        count: 1,
        lastLoginString: `${a} | ${b}`,
      },
    });

    return res
      .status(200)
      .json({ user: newUser, status: true, message: "Sign Up successful." });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const GetUsers = async (req, res) => {
  try {
    let users = await User.find({}).select(["-email"]);
    return res.status(200).json({ users, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const GetUserById = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Bad request! User ID is required." });
    }
    let user = await User.findOne({ _id: id }).select(["-email"]);
    return res.status(200).json({ user, status: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

const UpdateStreak = async (req, res) => {
  try {
    const { emailAddress } = req.body;
    if (!emailAddress) {
      return res
        .status(400)
        .json({ message: "Bad request! Email address is required." });
    }
    const user = await User.findOne({ emailAddress });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const lastLogin = user.streaks.lastLogin;
    const timeDifference = Math.floor((now - lastLogin) / (1000 * 60 * 60));
    let a = now.getHours().toString();
    let b = now.getMinutes().toString();
    console.log(timeDifference);

    if (timeDifference >= 24 && timeDifference < 24) {
      console.log("streak +1");
      user.streaks.count += 1;
      user.streaks.lastLoginString = `${a} | ${b}`;
    } else if (timeDifference > 48) {
      console.log("streak reset");
      user.streaks.count = 1;
      user.streaks.lastLoginString = `${a} | ${b}`;
    } else {
      console.log("streak reset 0");
      user.streaks.count = 1;
      user.streaks.lastLoginString = `${a} | ${b}`;
    }

    user.streaks.lastLogin = now;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message, status: false });
  }
};

module.exports = {
  Login,
  SignUp,
  CreateProfile,
  AddInterests,
  UpdateProfile,
  GetProfile,
  AddStory,
  GetStories,
  GetStoryById,
  profileDetails,
  UpdateUserProfile,
  // GetStoryWithoutId,
  DeleteStory,
  CreateUser,
  GetUsers,
  GetUserById,
  UpdateStreak,
  getAllStories,
};
