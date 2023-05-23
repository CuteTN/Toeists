import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true, },
    text: { type: String, required: true, },
    url: { type: String, required: true, },
    kind: { type: String, required: true, },
    isSeen: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

export var Notification = mongoose.model("notifications", notificationSchema)
