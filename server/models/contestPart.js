import mongoose from "mongoose";

const contestPartSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    part: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    resource: {
      type: Object,
      required: true,
    },
    answers: {
      type: [String],
      required: true,
      select: false,
    }
  },
  { timestamps: true }
);

contestPartSchema.virtual("creator", {
  ref: "users",
  localField: "creatorId",
  foreignField: "_id",
  justOne: true,
});

export const CONTEST_PART_VIRTUAL_FIELDS = ["creator",];

contestPartSchema.set("toObject", { virtuals: true });
contestPartSchema.set("toJSON", { virtuals: true });

export var ContestPart = mongoose.model("contest_parts", contestPartSchema);

// EACH PART MODEL //////////////////////////////////////////////////////////////////////////////////////////////////// 
/*
part1:

*/
