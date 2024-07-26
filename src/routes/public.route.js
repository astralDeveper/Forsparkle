const { Router } = require("express");
const { verifyToken } = require("../utlis/auth.js");
const { GetOffers, GetOfferById, GetGifts, GetGiftById, GetStories, GetStory, AddStoryView } = require("../controllers/public.controller.js");
const route = Router();


route.get("/get-offers", verifyToken, GetOffers);
route.get("/get-offer/:id", verifyToken, GetOfferById);
route.get("/get-gifts", verifyToken, GetGifts);
route.get("/get-offer/:id", verifyToken, GetGiftById);
route.get("/get-stories", verifyToken, GetStories);
route.get("/get-story/:id", verifyToken, GetStory);
route.put("/view-story/:id", verifyToken, AddStoryView);


module.exports = route;