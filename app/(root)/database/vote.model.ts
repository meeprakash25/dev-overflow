import { Model, model, models, Schema, Types, Document } from "mongoose"

export interface IVote {
  author: Types.ObjectId
  targetId: Types.ObjectId
  targetType: "question" | "answer"
  voteType: "upvote" | "downvote"
}

export interface IVoteDoc extends IVote, Document{}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  {
    timestamps: true,
  },
)

const Vote = (models.Vote as Model<IVote> | undefined) ?? model<IVote>("Vote", VoteSchema)

export default Vote
