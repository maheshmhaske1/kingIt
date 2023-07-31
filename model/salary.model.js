const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: {
    type: String,
    
  },
  coins: {
    type: Number,

  },
},
{
  timestamps: true,
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
