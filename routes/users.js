const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const usersController = require("../controllers/users")

router.use(cookieParser());
router.get("/", usersController.start)
// route auth
router.post("/register", usersController.registerUser);
router.get("/validateUser/:token", usersController.activeUser);
router.post("/login", usersController.loginUser);
router.get("/user-info", usersController.usersInfo); 
router.post("/forgotpassword", usersController.forgetpassword);
router.post("/createnewpassword/:token", usersController.createnewpassword);
router.post("/auth/google", usersController.loginGoogle);
router.get("/auth/google/callback", usersController.callbackAfterloginGoogle)

// route crud user
router.post("/user", usersController.createUser);
router.get("/user/:id", usersController.getOneUserById);
router.delete("/user", usersController.deleteOneUser);
router.put("/user", usersController.updateOneUser);
router.get("/alluser", usersController.getAllUsers);

module.exports = router;