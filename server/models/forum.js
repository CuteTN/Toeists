import mongoose from "mongoose"
import { Comment } from "./comment.js";
import { InteractionInfo } from "./interactionInfo.js";

const forumSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
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
    interactionInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interaction_infos',
      required: true
    },
    hashtagIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'hashtags',
      required: true,
      default: [],
    }
  },
  { timestamps: true }
)

forumSchema.virtual('creator', {
  ref: 'users',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true
})

forumSchema.virtual('interactionInfo', {
  ref: 'interaction_infos',
  localField: 'interactionInfoId',
  foreignField: '_id',
  justOne: true,
})

forumSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'forumId',
})

export const FORUM_VIRTUAL_FIELDS = ['creator', 'interactionInfo', 'comments'];

forumSchema.post('findOneAndDelete', async (doc) => {
  await doc.populate('comments');
  doc.comments.foreach?.(cmt => Comment.findByIdAndDelete(cmt._id));
  await InteractionInfo.findByIdAndDelete(doc.interactionInfoId);
});

forumSchema.set('toObject', { virtuals: true });
forumSchema.set('toJSON', { virtuals: true });

export var Forum = mongoose.model("forums", forumSchema)
