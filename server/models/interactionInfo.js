import mongoose from "mongoose"

const interactionInfoSchema = new mongoose.Schema(
  {
    upvoterIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      required: true,
      default: [],
    },
    downvoterIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      required: true,
      default: [],
    },
    followerIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      required: true,
      default: [],
    },
  },
  { timestamps: true }
)

export var InteractionInfo = mongoose.model("interaction_infos", interactionInfoSchema)
