import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/users.js";
import { recipeRouter } from "./routes/recipes.js";

const app = express();

// whenever we get data from the frontend it will convert it into json
app.use(express.json());
app.use(cors());

// all the end points ends wrote at USERS.js are stored as /auth
app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

mongoose.connect(
  "mongodb+srv://root:kunalkunal@recipe-app.snzecm7.mongodb.net/recipe-app?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => {
  console.log("Server Started");
});
