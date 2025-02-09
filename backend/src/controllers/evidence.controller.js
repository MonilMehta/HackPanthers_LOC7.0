import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Evidence } from "../models/evidence.models.js";
import { Case } from "../models/case.models.js";

const getAllCases = asyncHandler(async (req, res) => {
  try {
    const cases = await Case.find({}, "caseNo title status reportedBy createdAt")
      .populate("reportedBy", "name")
      .lean();
    return res.status(200).json(new ApiResponse(200, cases, "Cases fetched"));
  } catch (error) {
    throw new ApiError(400, "Cases not found");
  }
});

const getCaseEvidence = asyncHandler(async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId) {
      throw new ApiError(400, "Case ID is required");
    }

    const evidence = await Evidence.find({ caseId })
      .select("type fileUrl uploadedBy")
      .populate("uploadedBy", "name")
      .lean();
    return res
      .status(200)
      .json(new ApiResponse(200, evidence, "Evidence fetched"));
  } catch (error) {
    throw new ApiError(404, "Evidence not found");
  }
});

const uploadEvidence = asyncHandler(async (req, res) => {
  try {
    const { caseId, type, fileUrl } = req.body;
    const uploadedBy = req.user._id;

    console.log(caseId, type, fileUrl, uploadedBy)
    if (!caseId || !type || !fileUrl) {
      throw new ApiError(400, "Case ID, type, and file URL are required");
    }
    console.log("hii")
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
        throw new ApiError(404, "Case not found");
    }
    console.log("hiii")
    
    const validTypes = ["Photo", "Video", "Document"];
    if (!validTypes.includes(type)) {
        throw new ApiError(400, "Invalid evidence type");
    }
    console.log("huhuy")
    
    const newEvidence = await Evidence.create({
        caseId,
        type,
        fileUrl,
        uploadedBy,
        createdAt: new Date()
    });
    console.log("huheuis")

    existingCase.evidence.push(newEvidence);
    await existingCase.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, newEvidence, "Evidence uploaded successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Failed to upload evidence");
  }
});

export { getAllCases, getCaseEvidence, uploadEvidence };
