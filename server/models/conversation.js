import mongoose from "mongoose"
import { Message } from "./message";

const conversationMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'none'],
      require: true,
      default: 'none'
    }
  },
  { timestamps: true, _id : false }
)

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: [conversationMemberSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
)

conversationSchema.virtual('messages', {
  ref: 'messages',
  localField: '_id',
  foreignField: 'conversationId',
})

conversationSchema.post('findOneAndDelete', async (doc) => {
  await doc.populate('messages');
  doc.messages.foreach?.(msg => Message.findByIdAndDelete(msg._id));
});

conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

export var Conversation = mongoose.model("conversations", conversationSchema)