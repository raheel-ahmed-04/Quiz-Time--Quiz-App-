const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const Student = new mongoose.model("Student", StudentSchema);

module.exports = Student;