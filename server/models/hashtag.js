import mongoose from "mongoose"

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export var Hashtag = mongoose.model("hashtags", hashtagSchema)
