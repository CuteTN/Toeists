import mongoose from "mongoose"

const certificateSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    type: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export var Certificate = mongoose.model("certificates", certificateSchema)
