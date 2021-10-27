import mongoose from "mongoose"

const conversationMemberSchema = mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'none'],
      require: true,
      default: 'none'
    }
  },
  { timestamps: true, _id : false }
)

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: [conversationMemberSchema],
      required: true,
      default: [],
    },
    messageIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'messages',
      required: true,
      default: [],
    },
  },
  { timestamps: true }
)

export var Conversation = mongoose.model("conversations", conversationSchema)
