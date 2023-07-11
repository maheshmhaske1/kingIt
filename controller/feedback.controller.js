const userfeedback = require('../model/feedback.model')

exports.addfeedback = async (req, res) => {
    const { name, email, userId, mobile, feedbackMessage } = req.body

    if (!name || !email || !feedbackMessage) {
        return res.json({
            status: false,
            message: "name ,email ,mobile,feedbackMessage are required fields"
        })
    }

    await new userfeedback({
        name: name,
        email: email,
        userId: userId,
        mobile: mobile,
        feedbackMessage: feedbackMessage
    })
        .save()
        .then((success) => {
            return res.json({
                status: true,
                message: "your feedback has been recorded",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong",
                data: error
            })
        })
}

exports.getAll = async (req, res) => {
    await userfeedback.find()
        .then((success) => {
            return res.json({
                status: true,
                message: "all feedbacks",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: true,
                message: "something went wrong",
                data: error
            })
        })
}