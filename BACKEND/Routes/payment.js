const express = require("express");
const router = express.Router();

router.post("/send", (req, res) => {
    // const amount = req.body.amount;
    // const to = req.body.to;
    const { amount, to } = req.body;

    res.json({
        msg: `Sent amount ${amount} to ${to} `
    })
})


router.get("/history", (req, res) => {
    res.json({
        msg: "Payment history"
    })
})
module.exports = router;