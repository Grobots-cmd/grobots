import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Ensure each robot slug is unique
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    weightClass: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one image is required",
      },
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    specifications: {
      dimensions: {
        length: String,
        width: String,
        height: String,
        weight: String,
      },
      materials: {
        chassis: String,
        panels: String,
        wheels: String,
        sensors: String,
      },
      components: {
        computer: String,
        lidar: String,
        cameras: String,
        imu: String,
        gps: String,
      },
      performance: {
        topSpeed: String,
        batteryLife: String,
        range: String,
        accuracy: String,
      },
    },

    achievements: [{
      year: Number,
      competition: String,
      placement: String,
      location: String,
    }],

    developmentStory: {
      concept: String,
      challenges: String,
      innovations: String,
      timeline: String,
    },

    technicalDetails: {
      navigationStack: String,
      sensorFusion: String,
      aiSystem: String,
      communication: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
