import mongoose from "mongoose"

const searchQuerySchema = new mongoose.Schema(
  {
    text: { type: String, },
    page: { type: Number, required: true, default: 0 },
    pageSize: { type: Number, required: true, default: 0 }
  },
  { _id: false, id: false, strict: false }
)

const searchRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false, },
    category: { type: String, required: true, },
    query: { type: searchQuerySchema, required: true },
  },
  { timestamps: true }
)

export var SearchRecord = mongoose.model("search_records", searchRecordSchema)