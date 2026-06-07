const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");
const authMiddleWare = require("../middleware");
const bcrypt = require("bcrypt");



const router = express.Router();


// zod is used for  the scema validataion 
const signUpBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8)
})

const updateBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8)
})

// route for to getThe list of the user from the backend

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    //filter gets the patter 

    const users = await User.find({ // this will return the array of the users !!
        $or: [
            {
                firstName: {
                    "$regex": filter
                }
            },
            {
                lastName: {
                    "$regex": filter
                }
            }
        ]
    }) // working as expected but need to revice this 

    res.json({ // this is used to send only spectific data / not all the data which are confidentials
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

// Updating the existing user details of the dataBases 

// i checked it this route is perfectly working 
router.put("/change", authMiddleWare, async (req, res) => {
    // after this authorization we got the userId;

    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg: "invalid inputes/Error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)

    res.status(200).json({
        message: "Updated successfully"
    })
    // working as expected!!
})


// -----------------------------------------------------------------------------------------------------------

router.post("/login", async (req, res) => {

    const existingUser = await User.findOne({
        userName: req.body.userName,
        password: req.body.password

    })

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser._id,
            name: existingUser.firstName
        }, JWT_SECRET);

        res.json({
            msg: "user logged in",
            token: token
        })
        return;
    } else {
        res.json({
            messgae: "Error occured while login/user not registerd"
        })
    }
})


// ------------------------------------------------------------------------------------------------------------------------

router.post("/signup", async (req, res) => {
    const { success } = signUpBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect input"
        })
    }

    const existingUser = await User.findOne({
        userName: req.body.userName
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already existed"
        })
    }

    // Now if userNot existed then put him into the dataBase 

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashPassword // here we need to first hash the password before sending it to the data-base so not any one able to accese the password
    })
    const firstname = user.firstName;

    const userId = user._id;

    const token = jwt.sign({
        userId,
        firstname
    }, JWT_SECRET);

    // Updating the with genrateed token-- this is the important thing to remember
    await User.updateOne({
        _id: userId
    }, {
        token: token
    })

    res.json({
        message: "User account is created sucessfully",
        token: token
    })


});

module.exports = router;