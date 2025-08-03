import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  type: { type: String, enum: ['Product', 'Service', 'Startup', 'Other'] }
});

export const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
