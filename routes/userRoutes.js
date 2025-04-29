const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateToken } = require("../middleware/token");

router.post("/signup", 
    userController.signup
);

router.post("/login", 
    userController.login
);

router.get("/user-detail", 
    validateToken, 
    userController.getUserDetails
);

router.put("/update-username", 
    validateToken, 
    userController.updateUsername
);

module.exports = router;
