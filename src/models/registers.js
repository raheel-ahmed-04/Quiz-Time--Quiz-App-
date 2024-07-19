const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  className: { type: String, required: true },
  classCode: { type: String, required: true, unique: true },
});

const quizSchema = new mongoose.Schema({
  name: String,
  subject: String,
  // questions: [questionSchema],
  totalquestion: Number,
  acquiredMarks: Number,
});

const Student = new mongoose.model("Student", StudentSchema);
const Teacher = new mongoose.model("Teacher", TeacherSchema);
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { Student, Teacher, Quiz };
