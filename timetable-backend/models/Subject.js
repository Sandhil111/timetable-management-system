const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  credits: { type: Number, required: true },
  semester: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);