const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Hash in prod!
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  name: { type: String, required: true },
  subjects: [String],  // For teachers
  class: String,  // For students
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);