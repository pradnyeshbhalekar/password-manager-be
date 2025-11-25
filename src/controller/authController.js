const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "No token provided" });

    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, name, email, picture } = ticket.getPayload();


    let user = await User.findOne({ googleId: sub });

    if (!user) {

      user = new User({
        googleId: sub,  
        username: name,
        email,
        profilePic: picture,
      });
      await user.save();
    }


    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
