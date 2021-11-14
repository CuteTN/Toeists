import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    deleteUrl: {
      type: String,
      unique: true,
    },
  },

  { timestamps: true }
)

export var Image = mongoose.model("images", imageSchema)
