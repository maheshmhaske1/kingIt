const userSupport = require('../model/support.model')

exports.addUserSupport = async (req, res) => {
    const { name, email, userId, message } = req.body

    if (!name || !email || !message) {
        return res.json({
            status: false,
            message: "name ,email ,message are required fields"
        })
    }

    await new userSupport({
        name: name,
        email: email,
        userId: userId,
        message: message
    })
        .save()
        .then((success) => {
            return res.json({
                status: true,
                message: "your message is sent with our team",
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
    await userSupport.find()
        .then((success) => {
            return res.json({
                status: true,
                message: "your support messages sent by users",
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