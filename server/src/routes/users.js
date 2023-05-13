import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModal } from "../models/Users";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // checking if the user exists or not
  const user = await UserModal.findOne({ username: username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModal({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User Registered Successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // checking if the user exists or not
  const user = await UserModal.findOne({ username: username });

  if (!user) {
    return res.json({ message: "User Doesn't Exist!" });
  }

  // hashing the inputted password and then comparing with hashed password alreay stored in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Username or Password is not valid" });
  }

  // when we have to login into an application we have to create a web token which
  // is going to represent your login session then we need to send it back to the client side - user
  // when we make any request we have to send this token along with it to authenticate we are this user

  // creating a token for
  // jwt = json web token
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

// middleware
export const verifyToken = (req, res, next) => {
  // token is in header
  const token = req.headers.authorization;

  // if we got any token then we have to verify it with the same secret
  if (token) {
    jwt.verify(token, "secret", (err) => {
      // user is not Authorized
      if (err) return res.sendStatus(403);

      // if there were no errors then continue with request
      next();
    });
  } else {
    // user is verified, noo token
    res.sendStatus(401);
  }
};
