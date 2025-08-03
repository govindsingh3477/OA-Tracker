import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  category: { type: String, enum: ['Topic', 'Concept'] }
});

export const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
