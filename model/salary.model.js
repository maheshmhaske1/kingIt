const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: {
    type: String,
    
  },
  coins: {
    type: Number,

  },
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
