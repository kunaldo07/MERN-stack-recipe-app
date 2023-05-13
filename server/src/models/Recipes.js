import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

// Name in the mongoDB database = recipes
export const RecipeModal = mongoose.model("recipes", RecipeSchema);
