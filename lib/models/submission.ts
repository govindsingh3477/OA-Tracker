import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // From Clerk
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'python', 'java', 'js','c'], required: true },
  status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'TLE'], default: 'Pending' },
  result: { type: String }, // Optional: detailed result json
  time: { type: Number }, // Execution time in ms
  memory: { type: Number }, // in MB
  judgeToken: { type: String },
  output: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
