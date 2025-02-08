import mongoose, { Schema } from "mongoose"; 

const CaseSchema = new mongoose.Schema({
  caseNo:{
    type: Number,
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Open", "Under Investigation", "Closed"], default: "Open" },
  assignedOfficers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: "Citizen", // Could be a citizen reporting the case
  },
  location: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidence" }],
  witnessStatements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Witness" }],
},{timestamps:true});

module.exports = mongoose.model("Case", CaseSchema);
