import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'conversations',
      required: true
    },
    text: {
      type: String,
      required: true,
    },
    attachedContent: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
)

export var Message = mongoose.model("messages", messageSchema)
