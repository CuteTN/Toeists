import mongoose from "mongoose"
import { Message } from "./message.js";
import { getPrivateConversation } from '../services/conversation.js'

const conversationMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    nickname: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'none'],
      require: true,
      default: 'none'
    },
    hasSeen: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasMuted: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
    hasBlocked: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
  },
  { timestamps: true, _id: false }
)

conversationMemberSchema.virtual('member', {
  ref: 'users',
  localField: 'memberId',
  foreignField: '_id',
  justOne: true,
})


////////////////////////////////////////////////////////////////////////////////////////////////////


const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    members: {
      type: [conversationMemberSchema],
      required: true,
    },
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    }
  },
  { timestamps: true }
)

export const CONVERSATION_VIRTUAL_FIELDS = ['messages', "members.member"];

conversationSchema.virtual('messages', {
  ref: 'messages',
  localField: '_id',
  foreignField: 'conversationId',
  options: {
    sort: { createdAt: 1 }
  },
})

conversationSchema.post('findOneAndDelete', async (doc) => {
  await doc.populate('messages');
  doc.messages.foreach?.(msg => Message.findByIdAndDelete(msg._id));
});

conversationSchema.pre('validate', async function (next) {
  if (this.type === "private") {
    if (this.members?.length !== 2)
      return next(this.invalidate('members', 'A private conversation must have exact 2 members.'));

    const existedConversation = await getPrivateConversation(this.members[0]?.memberId, this.members[1]?.memberId);

    if (!existedConversation._id.equals(this._id))
      return next(this.invalidate('members', 'The private conversation of these 2 members has already existed.'));
  }

  if (this.type === "group") {
    if (!this.name)
      return next(this.invalidate('name', 'A group conversation must have a name.'));

    if (!this.members.some(member => member.role === "admin"))
      return next(this.invalidate('members', 'A group conversation must have at least 1 admin.'));
  }

  next();
});

conversationMemberSchema.set('toObject', { virtuals: true });
conversationMemberSchema.set('toJSON', { virtuals: true });

conversationSchema.set('toObject', { virtuals: true });
conversationSchema.set('toJSON', { virtuals: true });

export var Conversation = mongoose.model("conversations", conversationSchema)