import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
);

export var RefreshToken = mongoose.model("refresh_tokens", refreshTokenSchema);