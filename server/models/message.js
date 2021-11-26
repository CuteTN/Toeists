import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    isSystemMessage: {
      type: Boolean,
      required: true,
      default: false,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
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