const { Router } = require("express");
const { CreateSuperAdmin, AdminLogin, CreateAdmin, GetUserById, GetUsers, BlockUser } = require("../controllers/admin/admin.controller");
const { verifyAdminToken } = require("../utlis/admin");
const { CreateOffer, UpdateOffer, GetOffer, DeleteOffer } = require("../controllers/admin/offer.controller");
const { CreateGift, UpdateGift, GetGift, DeleteGift } = require("../controllers/admin/gift.controller");
const { GiftImageUploader } = require("../utlis/fileUploder");
const route = Router();


route.post("/create-super-admin/123123", CreateSuperAdmin);
route.post("/create-admin", verifyAdminToken, CreateAdmin);
route.post("/login", AdminLogin);

route.get("/get-users", verifyAdminToken, GetUsers);
route.get("/get-user/:id", verifyAdminToken, GetUserById);
route.put("/block-user/:id", verifyAdminToken, BlockUser);

// offer route 
route.post("/create-offer", verifyAdminToken, CreateOffer);
route.put("/edit-offer/:id", verifyAdminToken, UpdateOffer);
route.get("/get-offer/:id", verifyAdminToken, GetOffer);
route.delete("/delete-offer/:id", verifyAdminToken, DeleteOffer);

// gift route 
route.post("/create-gift", verifyAdminToken, GiftImageUploader, CreateGift);
route.put("/edit-gift/:id", verifyAdminToken, GiftImageUploader, UpdateGift);
route.get("/get-gift/:id", verifyAdminToken, GetGift);
route.delete("/delete-gift/:id", verifyAdminToken, DeleteGift);

module.exports = route;