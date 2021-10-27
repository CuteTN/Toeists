import mongoose from "mongoose"

const commentSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    contentCreatedAt: {
      type: Date,
      required: true
    },
    contentUpdatedAt: {
      type: Date,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    interactionInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interaction_infos',
      required: true
    }
  },
  { timestamps: true }
)

export var Comment = mongoose.model("comments", commentSchema)
