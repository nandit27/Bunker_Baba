const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const WeeklySchedule = require('../models/WeeklySchedule');

const migrateData = async () => {
  try {
    // Use production MongoDB URI
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const weeklySchedulePath = path.join(__dirname, '../utils/weeklySchedule.json');
    const data = JSON.parse(fs.readFileSync(weeklySchedulePath, 'utf8'));
    
    // Convert and insert data
    const schedules = Object.entries(data).map(([department, subjects]) => ({
      department,
      subjects: Object.entries(subjects).map(([fullCode, details]) => {
        const [code, name] = fullCode.split('/').map(s => s.trim());
        return {
          code,
          name: name || code,
          lectures: details.lectures,
          labs: details.labs
        };
      })
    }));
    
    // Clear existing data
    await WeeklySchedule.deleteMany({});
    
    // Insert new data
    await WeeklySchedule.insertMany(schedules);
    
    console.log('Data migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateData(); 