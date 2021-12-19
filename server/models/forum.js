import mongoose from "mongoose";
import { Comment } from "./comment.js";
import { InteractionInfo } from "./interactionInfo.js";

// this is for mongoose to initialize the hashtags schema first
import "./hashtag.js";
import { reduceHashtagPreferences } from "../services/hashtag.js";

const forumSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      validate: [
        {
          validator: async (title) => {
            if (title) return true;
          },
          message: () => "The title of a forum is required.",
        },
      ],
    },
    content: {
      type: String,
      required: true,
    },
    contentCreatedAt: {
      type: Date,
      required: true,
    },
    contentUpdatedAt: {
      type: Date,
      required: true,
    },
    interactionInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interaction_infos",
      required: true,
    },
    hashtagIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "hashtags",
      required: true,
      default: [],
      maxlength: 10,
    },
  },
  { timestamps: true }
);

forumSchema.virtual("creator", {
  ref: "users",
  localField: "creatorId",
  foreignField: "_id",
  justOne: true,
});

forumSchema.virtual("interactionInfo", {
  ref: "interaction_infos",
  localField: "interactionInfoId",
  foreignField: "_id",
  justOne: true,
});

forumSchema.virtual("comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "forumId",
});

forumSchema.virtual("hashtags", {
  ref: "hashtags",
  localField: "hashtagIds",
  foreignField: "_id",
});

export const FORUM_VIRTUAL_FIELDS = [
  "creator",
  "interactionInfo",
  "comments",
  "hashtags",
];

forumSchema.post("findOneAndDelete", async (doc) => {
  await doc.populate("comments hashtags");
  doc.comments.foreach?.((cmt) => Comment.findByIdAndDelete(cmt._id));
  await InteractionInfo.findByIdAndDelete(doc.interactionInfoId);
  await reduceHashtagPreferences(doc.hashtags?.map((ht) => ht.name));
});

forumSchema.set("toObject", { virtuals: true });
forumSchema.set("toJSON", { virtuals: true });

export var Forum = mongoose.model("forums", forumSchema);
