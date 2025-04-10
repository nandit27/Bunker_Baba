const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lectures: {
    type: Number,
    required: true,
    default: 0
  },
  labs: {
    type: Number,
    required: true,
    default: 0
  }
});

const weeklyScheduleSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  subjects: [subjectSchema]
});

module.exports = mongoose.model('WeeklySchedule', weeklyScheduleSchema); 