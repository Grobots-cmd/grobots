import mongoose from "mongoose";

const TeamMember = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    achievements: [{
      type: String,
      trim: true,
    }],
    social: {
      email: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "#",
      },
      github: {
        type: String,
        default: "#",
      },
      instagram: {
        type: String,
        default: "#",
      },
    },
    isAlumni: {
      type: Boolean,
      required: true,
      default: false,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMember);
