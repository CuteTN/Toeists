import mongoose from "mongoose";
import emailValidator from 'email-validator'
import { reduceHashtagPreferences } from "../services/hashtag.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: {
      type: String, required: true,
      validate: [
        {
          validator: async function (username) {
            const usernameUpper = username?.toUpperCase?.();
            const user = (await this.constructor.find())
              .filter(u => u?.username?.toUpperCase() === usernameUpper)?.[0];

            if (user)
              return this._id.equals(user._id);
            return true;
          },
          message: props => `The username ${props.value} is already taken.`
        },
        {
          validator: function (username) {
            return !emailValidator.validate(username);
          },
          message: props => `Emails cannot be used as usernames`
        },
        {
          validator: function (username) {
            return !mongoose.isValidObjectId(username)
          },
          message: props => `Username is confusing to server as it can be casted to an ID.`
        }

      ],
    },
    email: {
      type: String, required: true,
      validate: [
        {
          validator: async function (email) {
            const emailUpper = email.toUpperCase?.();
            const user = (await this.constructor.find())
              .filter(u => u?.email?.toUpperCase() === emailUpper)?.[0];

            if (user)
              return this._id.equals(user._id);
            return true;
          },
          message: props => `The email address ${props.value} is already in use.`
        },
        {
          validator: function (email) {
            return emailValidator.validate(email);
          },
          message: props => `Invalid email.`
        }
      ],
    },
    phoneNumber: {
      type: String,
      validate: [
        {
          validator: async function (phoneNumber) {
            if (!phoneNumber)
              return true;

            const user = (await this.constructor.find())
              .filter(u => u?.phoneNumber === phoneNumber)?.[0];

            if (user)
              return this._id.equals(user._id);
            return true;
          },
          message: props => `The phone number ${props.value} is already in use.`
        },
      ]
    },
    hashedPassword: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    birthday: { type: Date },
    avatarUrl: { type: String, maxLength: 200 },
    description: { type: String },
    isActivated: { type: Boolean, default: false },

    hashtagIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'hashtags',
      required: true,
      default: [],
      maxlength: 10,
    }

    /*
     rating: { type: Number },
     certificateIds
     */
  },
  { timestamps: true }
);

userSchema.virtual('hashtags', {
  ref: 'hashtags',
  localField: 'hashtagIds',
  foreignField: '_id',
});

export const USER_VIRTUAL_FIELDS = ["hashtags"];

userSchema.post('findOneAndDelete', async (doc) => {
  await doc.populate('hashtags');
  await reduceHashtagPreferences(doc.hashtags?.map(ht => ht.name));
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export var User = mongoose.model("users", userSchema);