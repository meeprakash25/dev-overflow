import { Document, Model, model, models, Schema, Types } from "mongoose"

export interface IAiAnswer {
  question: Types.ObjectId
  answer: string
  user: Types.ObjectId
}

export interface IAiAnswerDoc extends IAiAnswer, Document {}

const AiAnswerSchema = new Schema<IAiAnswer>(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answer: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

const AiAnswer = (models.AiAnswer as Model<IAiAnswer> | undefined) ?? model<IAiAnswer>("AiAnswer", AiAnswerSchema)

export default AiAnswer
