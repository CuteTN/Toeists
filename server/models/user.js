import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export var Users = mongoose.model("users", userSchema);