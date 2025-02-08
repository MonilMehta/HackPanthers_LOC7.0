import mongoose, { Schema } from "mongoose"; 

const EvidenceSchema = new mongoose.Schema({
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    type: { type: String, enum: ["Photo", "Video", "Document"], required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Officer", required: true },
    uploadedAt: { type: String},
  });

export const Evidence = mongoose.model("Evidence",EvidenceSchema);

