require("dotenv").config();
var express = require("express");
var multer = require("multer");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var mongo = require("./models/connection");
var uschema = require("./models/userData.model");
var cookieParser = require("cookie-parser");
var hbs = require("hbs");

var port = 3000;

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

var logged_in_user_data;

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.set("view engine", "hbs");

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    response += `<img src="${req.file.path}" /><br>`;
    return res.send(response);
  }
);

app.post(
  "/profile-upload-multiple",
  upload.array("profile-files", 12),
  function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    for (var i = 0; i < req.files.length; i++) {
      response += `<img src="${req.files[i].path}" /><br>`;
    }
    return res.send(response);
  }
);

const auth = async (req, res, next) => {
  try {
    console.log("auth is called!");
    const token_from_cookie = req.cookies.jwt_cookie;
    console.log("token_from_cookie>>", token_from_cookie);

    const verifyUser = jwt.verify(token_from_cookie, process.env.SECRET_KEY);
    console.log("verifyUser>>", verifyUser);

    const user = await uschema.findOne({ _id: verifyUser.id });
    console.log("user>>", user);
    next();
  } catch (err) {
    console.log("error in auth");
    res.status(401).send(err);
  }
};

//---------- (get data from HTML to node server) ----------//
// app.post("/",upload.none(), (req, res) => {
//   console.log(req.body)
// })

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/", (req, res) => {
  //------ (Inserting data in mongodb schema) ------//
  var mongodata = new uschema({
    name: req.body.username,
    email: req.body.email,
    password: req.body.pass,
  });
  //------ (Inserting data in mongodb schema) ------//

  //------------------ (JsonWebToken) ------------------//
  var token = jwt.sign({ id: mongodata._id }, process.env.SECRET_KEY);
  console.log("==>", token);

  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    console.log("decoded>>", decoded.id);
  });
  //------------------ (JsonWebToken) ------------------//

  //--------- (Saving the jwt in cookies) ---------//
  res.cookie("jwt_cookie", token, {
    expires: new Date(Date.now() + 15000),
    httpOnly: true,
  });
  //--------- (Saving the jwt in cookies) ---------//

  //-------- (Saving data in mongodb) --------//
  mongodata.save(function (err, result) {
    if (err) {
      // console.log(err);
      console.log("Error occured while saving data!");
    } else {
      // console.log(result)
      console.log("Data saved in database");
    }
  });
  //-------- (Saving data in mongodb) --------//

  res.redirect("login");
});
//---------- (get data from HTML to node server) ----------//

app.get("/up", auth, (req, res) => {
  res.render("upload_pic", { liud: logged_in_user_data });
});

app.get("/login", (req, res) => {
  res.render("login");
  // res.redirect("up")
});

app.post("/login_auth", async (req, res) => {
  const user_data_to_login = await uschema.findOne({ email: req.body.emailid });
  if (user_data_to_login) {
    if (user_data_to_login.password == req.body.pass) {
      //------------------ (JsonWebToken) ------------------//
      var login_token = jwt.sign(
        { id: user_data_to_login._id },
        process.env.SECRET_KEY
      );
      console.log("==>", login_token);

      jwt.verify(login_token, process.env.SECRET_KEY, function (err, decoded) {
        console.log("decoded>>", decoded.id);
      });
      //------------------ (JsonWebToken) ------------------//

      //--------- (Saving the jwt in cookies) ---------//
      res.cookie("jwt_cookie", login_token, {
        expires: new Date(Date.now() + 1000 * 60 * 2),
        httpOnly: true,
      });
      //--------- (Saving the jwt in cookies) ---------//

      logged_in_user_data = user_data_to_login;
      res.redirect("up");
    } else {
      res.send({ status: "error", msg: "Incorrect password!" });
    }
  } else {
    res.send({ status: "error", msg: "User data missing!" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}!`));
