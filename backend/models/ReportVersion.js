const mongoose = require("mongoose");

const reportVersionSchema = new mongoose.Schema(
  {
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    versionNumber: { type: Number, required: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true }, // full report content snapshot
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

reportVersionSchema.index({ report: 1, versionNumber: 1 }, { unique: true });

module.exports = mongoose.model("ReportVersion", reportVersionSchema);
module.exports =
  mongoose.models.ReportVersion || mongoose.model("ReportVersion", reportVersionSchema);