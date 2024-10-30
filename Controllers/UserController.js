const userModel = require("./../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const loginUser = async(req, res) =>{
  const {email,password} = req.body;
  try{
    const user = await userModel.findOne({email});
    if(!user)
    {
      return res.json({success:false, message:"User doesn't exist"});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)
    {
      return res.json({success:false,message:"Invalid Credentials"});
    }
    const token = createToken(user._id);
    res.json({success:true,token});
  }
  catch(error)
  {
      res.json({success:false, message:"Error"});
  }
}
const createToken = (id) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id }, secret, { expiresIn: "1h" }); // Set expiration
};
const registerUser = async (req, res) => {
  
  const { name, password, email } = req.body;
  try {
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Await here

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};



module.exports = { loginUser, registerUser };

