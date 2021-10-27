import mongoose from "mongoose"

const forumSchema = mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    interactionInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interaction_infos',
      required: true
    },
    commentIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'comments',
      required: true,
      default: [],
    },
    hashtagIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'hashtags',
      required: true,
      default: [],
    }
  },
  { timestamps: true }
)

export var Forum = mongoose.model("forums", forumSchema)
