import mongoose from "mongoose"

const contestSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false, },
    contestPartId: { type: mongoose.Schema.Types.ObjectId, ref: "contest_parts", required: false, },
    expectedAnswers: { type: [String], required: true },
    actualAnswers: { type: [String], required: true },
    score: { type: Number, required: true }
  },
  { timestamps: true }
)

contestSubmissionSchema.set("toObject", { virtuals: true });
contestSubmissionSchema.set("toJSON", { virtuals: true });

export var ContestSubmission = mongoose.model("contest_submissions", contestSubmissionSchema)