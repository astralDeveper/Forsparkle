const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// routes 
const authRoute = require("./routes/auth.route.js");
const friendShipRoute = require("./routes/friendship.route.js");
const adminRoute = require("./routes/admin.route.js");
const publicRoute = require("./routes/public.route.js");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));


app.get("/test", (req, res) => {
    return res.status(200).json({ msg: "test hello!" })
});

app.use("/admin-route", adminRoute);
app.use("/auth", authRoute);
app.use("/friend-ship", friendShipRoute);
app.use("/", publicRoute);


module.exports = app;