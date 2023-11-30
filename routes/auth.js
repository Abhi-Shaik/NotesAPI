const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser=require("../middeware/fetchuser");
// create a user  using ppost "/api/auth" doesn't require auth
const JWT_SECRET = "Ab@280102!";
router.post(
  "/createuser",
  [
    body("name", "Enter a vaid name").isLength({ min: 3 }),
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Passoword should be min of 5 length").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      // console.log(user);
      if (user) {
        return res.status(400).send("email already registered");
      }
      const salt = await bcrypt.genSalt(10);
      let securedPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: securedPass,
        email: req.body.email,
      });
      // res.send(user);
      const data = {
        user: {
          id: user.id,
        },
      };
      console.log(data);
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.send({ authtoken: authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);
router.post(
  '/login',
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "please enter the password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
        const {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                "message" : "Please enter correct credentials"
            });
        }
        const passCompare= await bcrypt.compare(password,user.password);
        if(!passCompare){
            return res.status(400).json({
                "message" : "Please enter correct credentials"
            });
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        res.json({authtoken})
    } catch (error) {
        console.log(error);
      return res.status(500).send("Internal Server Error Occured");
    }
  }
);

router.post("/getuser",fetchuser, async(req,res)=>{
    
  // console.log(req.id);
  // res.send("bye");
  try {
    const user_id=req.id;
    const user=await User.findById(user_id).select("-password");
    // const user=await User.findOne({_id:user_id});
    // console.log(user_id);
    return res.send(user);
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }

} )
module.exports = router;
