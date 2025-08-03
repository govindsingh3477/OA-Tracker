import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isSample: { type: Boolean, default: false },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
});

export const TestCase = mongoose.models.TestCase || mongoose.model("testcases", testCaseSchema);
