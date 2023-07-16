const mongoose = require('mongoose')

const salaryHistorySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
        },
        createdBy: {
            type: mongoose.Types.ObjectId
        },
        cleared_salary: {
            type: Number,
            ref: "users"
        },
        percentage: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

const salaryHistory_Model = mongoose.model('salaryHistorys', salaryHistorySchema)
module.exports = salaryHistory_Model