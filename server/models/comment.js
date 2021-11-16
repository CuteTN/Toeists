import mongoose from "mongoose"
import { InteractionInfo } from "./interactionInfo.js";

const commentSchema = new mongoose.Schema(
  {
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'forums',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    contentCreatedAt: {
      type: Date,
      required: true
    },
    contentUpdatedAt: {
      type: Date,
      required: true
    },
    content: {
      type: Object,
      required: true,
    },
    interactionInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interaction_infos',
      required: true
    }
  },
  { timestamps: true }
)

export const COMMENT_VIRTUAL_FIELDS = ['creator', 'interactionInfo'];

commentSchema.virtual('creator', {
  ref: 'users',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true
})

commentSchema.virtual('interactionInfo', {
  ref: 'interaction_infos',
  localField: 'interactionInfoId',
  foreignField: '_id',
  justOne: true,
})

commentSchema.post('findOneAndDelete', async (doc) => {
  await InteractionInfo.findByIdAndDelete(doc.interactionInfoId);
});

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export var Comment = mongoose.model("comments", commentSchema)
