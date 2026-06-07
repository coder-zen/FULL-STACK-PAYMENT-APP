const express = require("express");

const router = express.Router();
const userRouter = require("./user")
const paymentRouter = require("./payment")

router.use("/user", userRouter);
router.use("/payment", paymentRouter);

module.exports = router;
