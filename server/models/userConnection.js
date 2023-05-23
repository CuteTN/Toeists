import mongoose from "mongoose"

const userConnectionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["following", "blocking", "none"],
      required: true
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
  },
  { timestamps: true }
)

export var UserConnection = mongoose.model("user_connections", userConnectionSchema)
