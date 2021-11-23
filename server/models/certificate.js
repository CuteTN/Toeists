import mongoose from "mongoose"

const certificateSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    type: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  { timestamps: true }
)

export const CERTIFICATE_VIRTUAL_FIELDS = ['owner'];

certificateSchema.virtual('owner', {
  ref: 'users',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
})

certificateSchema.set('toObject', { virtuals: true });
certificateSchema.set('toJSON', { virtuals: true });

export var Certificate = mongoose.model("certificates", certificateSchema)
