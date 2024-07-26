const { Router } = require("express");
const { Login, SignUp, CreateProfile, AddInterests, UpdateProfile, GetProfile, AddStory, GetStories, GetStoryById, DeleteStory, CreateUser, GetUsers, GetUserById, UpdateStreak, GetStoryWithoutId, getAllStories, profileDetails, UpdateUserProfile } = require("../controllers/auth.controller.js");
const { verifyToken } = require("../utlis/auth.js");
const { ProfileImageUploader, StorieUploader } = require("../utlis/fileUploder.js");

const route = Router();

route.post("/login", Login);
route.post("/sign-up", SignUp);
route.post("/create-profile", verifyToken, ProfileImageUploader, CreateProfile);
route.put("/add-interests", verifyToken, AddInterests);
route.put("/update-profile", verifyToken, ProfileImageUploader, UpdateProfile);
route.get("/get-profile", verifyToken, GetProfile);

// story routes 
route.put("/add-story", verifyToken, StorieUploader, AddStory);
route.get("/get-stories", verifyToken, GetStories);
route.get("/get-story/:id", verifyToken, GetStoryById);
route.get('/stories', getAllStories)
route.delete("/delete-story/:id", verifyToken, DeleteStory);
route.get("/profile-details", verifyToken, profileDetails);
route.get("/update-user-profile", verifyToken, ProfileImageUploader, UpdateUserProfile);


// Parveen App Routes 
route.post("/create-user", CreateUser);
route.get("/get-users", GetUsers);
route.get("/get-user/:id", GetUserById);
route.post("/add-streak", UpdateStreak);


module.exports = route;
