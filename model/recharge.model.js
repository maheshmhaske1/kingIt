const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
  image: {
    type: String,
  
  },
  username: {
    type: String,
   
  },
  sender: {
    type: String,
   
  },
  name: {
    type: String,
    
  },
  paymentId: {
    type: String,
   
  },
  price: {
    type: Number,

  },
  coin: {
    type: Number,
  
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
},
{
  timestamps: true,
});

const Recharge = mongoose.model('Recharge', rechargeSchema);

module.exports = Recharge;
