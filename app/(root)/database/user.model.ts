import { model, models, Schema, Document, Model } from "mongoose"

export interface IUser {
  name: string
  username: string
  email: string
  bio?: string
  image?: string
  location?: string
  portfolio?: string
  reputation?: number
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const User = models.User as Model<IUser> | undefined ?? model<IUser>("User", UserSchema)

export default User
