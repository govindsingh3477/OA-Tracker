import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  inputFormat: { type: String },
  outputFormat: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topicTags: [{ type: String }],
  companyTags: [{ type: String }],
  dateAsked: { type: Date },
  role: { type: String }, // e.g. SDE, Data Analyst
  level: { type: String }, // e.g. Internship, L1, L2, etc.
  intent: { type: String }, // e.g. Hire, Internship, Full-time
  companyType: { type: String }, // e.g. Product, Service
  testCases:[{ type: mongoose.Schema.Types.ObjectId, ref: "testcases" }],
  starterCode: { type: String },
  functionSignature: { type: String },
  constraints: { type: String },
  referenceSolution: { type: String },
}, { timestamps: true });

export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
