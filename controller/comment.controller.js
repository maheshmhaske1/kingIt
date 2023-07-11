const { default: mongoose } = require('mongoose')
const commentModel = require('../model/comment.model')
const userModel = require('../model/user.model')
const postModel = require('../model/post.model')

exports.addComment = async (req, res) => {
    const { userId, postId, comment } = req.body

    if (!userId || !comment || !postId) {
        return res.json({
            status: false,
            message: "please provide userId , comment , postId"
        })
    }

    const isUserExist = await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) })

    if (!isUserExist) {
        return res.json({
            status: false,
            message: "please provide valid user id"
        })
    }
    const isPostExist = await postModel.findOne({ _id: mongoose.Types.ObjectId(postId) })

    if (!isPostExist) {
        return res.json({
            status: false,
            message: "please provide valid post id"
        })
    }

    await new commentModel({
        postId: postId,
        userId: userId,
        comment: comment
    })
        .save()
        .then(success => {
            return res.json({
                status: true,
                message: "comment added for the post",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}

exports.updateComment = async (req, res) => {
    const { userId, commentId, comment } = req.body

    if (!userId || !commentId) {
        return res.json({
            status: false,
            message: "please provide userId , commentId "
        })
    }

    const isUserExist = await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) })
    if (!isUserExist) {
        return res.json({
            status: false,
            message: "please provide valid user id"
        })
    }

    const isCOmmentExist = await commentModel.findOne({ _id: mongoose.Types.ObjectId(commentId) })
    if (!isCOmmentExist) {
        return res.json({
            status: false,
            message: "please provide valid commentId id"
        })
    }

    if (!isCOmmentExist.userId.equals(userId)) {
        return res.json({
            status: false,
            message: "you are not authorized"
        })
    }

    commentModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(commentId) },
        {
            $set: { comment: comment }
        })
        .then(success => {
            return res.json({
                status: true,
                message: "comment edited successfully"
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })

}

exports.deleteComment = async (req, res) => {
    const { userId, commentId } = req.body

    if (!userId || !commentId) {
        return res.json({
            status: false,
            message: "please provide userId , commentId "
        })
    }

    const isUserExist = await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) })
    if (!isUserExist) {
        return res.json({
            status: false,
            message: "please provide valid user id"
        })
    }

    const isCOmmentExist = await commentModel.findOne({ _id: mongoose.Types.ObjectId(commentId) })
    if (!isCOmmentExist) {
        return res.json({
            status: false,
            message: "please provide valid commentId id"
        })
    }

    if (!isCOmmentExist.userId.equals(userId)) {
        return res.json({
            status: false,
            message: "you are not authorized"
        })
    }

    commentModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(commentId) })
        .then(success => {
            return res.json({
                status: true,
                message: "comment deleted successfully"
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })

}