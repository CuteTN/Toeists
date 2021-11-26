import mongoose from "mongoose"
import { validateHashtagName } from "../services/hashtag.js";

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: [
        {
          validator: async function (name) {
            const hashtag = await this.constructor.findOne({ name })

            if (hashtag)
              return this._id.equals(hashtag._id);
            return true;
          },
          message: props => `Duplicate hashtag name ${props.value}.`
        },
        {
          validator: name => validateHashtagName(name).isValid,
          message: props => validateHashtagName(props.value).message
        }
      ]
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { timestamps: true }
)

export var Hashtag = mongoose.model("hashtags", hashtagSchema)