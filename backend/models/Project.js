const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },

    abstract: {
      type: String,
      required: true,
      trim: true,
    },

    reportFile: {
      type: String,
      required: true,
    },

    sourceCodeFile: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Uploaded", "Processing", "Completed", "Failed"],
      default: "Uploaded",
    },

    score: {
      type: Number,
      default: null,
    },

    suggestions: {
      type: [String],
      default: [],
    },

    assessment: {
      documentationQuality: {
        type: Number,
        default: null,
      },

      projectCompleteness: {
        type: Number,
        default: null,
      },

      codeStructure: {
        type: Number,
        default: null,
      },

      innovation: {
        type: Number,
        default: null,
      },

      technologyStack: {
        type: Number,
        default: null,
      },

      missingModules: {
        type: Number,
        default: null,
      },

      overallScore: {
        type: Number,
        default: null,
      },
      confidenceScore: {
  type: Number,
  default: null,
},

      strengths: {
        type: [String],
        default: [],
      },

      improvements: {
        type: [String],
        default: [],
      },

      recommendation: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);