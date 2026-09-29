import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    name: {
      type: String,
      default: "Untitled resume",
    },

    ownerId: {
      type: String,
      default: null,
    },

    data: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Resume =
  models.Resume || mongoose.model("Resume", ResumeSchema);