const { default: mongoose } = require('mongoose')
const likeModel = require('../model/like.model')
const userModel = require('../model/user.model')
const postModel = require('../model/post.model')

exports.addLike = async (req, res) => {
    const { userId, postId } = req.body

    if (!userId || !postId) {
        return res.json({
            status: false,
            message: "please provide userId , postId"
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

    const isAlreadyLiked = await likeModel.findOne({ postId: mongoose.Types.ObjectId(postId), userId: mongoose.Types.ObjectId(userId) })
    if (isAlreadyLiked) {
        return res.json({
            status: false,
            message: "you already liked this post"
        })
    }

    await new likeModel({
        postId: postId,
        userId: userId
    })
        .save()
        .then(success => {
            return res.json({
                status: true,
                message: "like added for the post",
                success: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}


exports.deleteLike = async (req, res) => {
    const { userId, postId } = req.body

    if (!userId || !postId) {
        return res.json({
            status: false,
            message: "please provide userId , postId "
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

    const isLikeExist = await postModel.findOne({ postId: mongoose.Types.ObjectId(postId), userId: mongoose.Types.ObjectId(userId) })
    if (!isLikeExist) {
        return res.json({
            status: false,
            message: "you are not liked this post"
        })
    }

    likeModel.findOneAndDelete({ postId: mongoose.Types.ObjectId(postId), userId: mongoose.Types.ObjectId(userId) })
        .then(success => {
            return res.json({
                status: true,
                message: "like deleted successfully",
                success: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })

}