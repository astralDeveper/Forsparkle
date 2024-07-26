const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    gender: {
      type: String,
    },
    stories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
        required: true,
      }
    ],
    image: {
      path: { type: String },
      filename: { type: String },
      mimetype: { type: String }
    },
    country: {
      type: String
    },
    address: {
      type: String
    },
    birthday: {
      type: String
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    bio: {
      type: String
    },
    tagline: {
      type: String
    },
    phone: {
      type: String
    },
    type: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user'
    },
    role: {
      type: String,
      enum: ['1', '2', '3'],
      default: '3'
    },
    name: {
      type: String,
      trim: true,
    },
    balance: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    picture: {
      path: { type: String },
      filename: { type: String },
      mimetype: { type: String }
    },
    // Parveen App Schema Fields 

    // emailAddress: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    // },
    // fullName: {
    //   type: String,
    // },
    // fullNameInLowerChars: {
    //   type: String,
    // },
    // id: {
    //   type: String,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // notificationToken: {
    //   type: String,
    // },
    // streaks: {
    //   count: {
    //     type: Number,
    //     default: 0
    //   },
    //   lastLogin: {
    //     type: Date,
    //     default: Date.now,
    //   },
    //   lastLoginString: {
    //     type: String,
    //   }
    // }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
