import express from "express";
import mongoose from "mongoose";
import { RecipeModal } from "../models/Recipes";
import { UserModal } from "../models/Users";
import { verifyToken } from "./users";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // finds all the recipes
    const response = await RecipeModal.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", async (req, res) => {
  const recipe = new RecipeModal(req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

// saving the recipes Id's into the users object
// verifyToken => only allow users who are verified to create the recipes
router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModal.findById(req.body.recipeID);
    const user = await UserModal.findById(req.body.userID);

    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// getting all the savedRecipes from the users
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModal.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModal.findById(req.params.userID);
    const savedRecipes = await RecipeModal.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

export { router as recipeRouter };
