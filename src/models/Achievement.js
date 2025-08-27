// models/Achievement.js

import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    nameOfEvent: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfEvent: {
      type: Date,
      required: false, // Made optional
    },
    images: {
      type: [String], // Array of image URLs (can be local or cloud hosted)
      default: [],
    },
    winningPosition: {
      type: String,
      required: true,
      trim: true,
    },
    prizeWon: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 150, // roughly 20–30 words
      trim: true,
    },
    longDescription: {
      type: String,
      required: true,
      maxlength: 2000, // roughly 300 words
      trim: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.Achievement ||
  mongoose.model("Achievement", AchievementSchema);
