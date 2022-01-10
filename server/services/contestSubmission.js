import { ContestPart } from "../models/contestPart.js";
import { ContestSubmission } from "../models/contestSubmission.js"


export const getOverallSubmissionsInfo = async (contestPartId) => {
  const contestPart = await ContestPart.findById(contestPartId).select("+answers");

  if (!contestPart)
    return null

  const result = {
    averageScore: 0,
    maxScore: contestPart?.answers?.length ?? 0,
    submissionsCount: 0
  }

  const submissions = await ContestSubmission.find({ contestPartId });
  result.submissionsCount = submissions.length;

  if (submissions.length) {
    result.averageScore = submissions.map(s => s.score).reduce((a, b) => a + b, 0) / submissions.length;
  }

  return result;
}