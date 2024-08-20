import mongoose, { Document, Schema } from "mongoose";

export interface IExpanse extends Document {
  name: string;
}

const ExpansesSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Expanses = mongoose.model<IExpanse>("Expanses", ExpansesSchema);

export default Expanses;
