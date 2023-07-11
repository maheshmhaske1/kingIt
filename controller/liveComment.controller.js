const { default: mongoose } = require('mongoose')
const liveComments = require('../model/liveComment.model');
const liveModel = require('../model/Live/Live.model');

exports.addComment = async (req, res) => {
    const { liveId, userId, comment } = req.body

    const isMutedUser = await liveModel.exists({
        _id: liveId,
        mutedUser: userId
    });

    if(isMutedUser){
        return res.json({
            status:false,
            message:"you are muted by host"
        })
    }

    await new liveComments({
        liveId: liveId, userId: userId,
        comment: comment
    })
        .save()
        .then((success) => {
            return res.json({
                status: true,
                message: "comment added"
            })
        })
        .catch((error) => {
            return res.json({
                status: false,
                message: "error"
            })
        })
}

exports.getComments = async (req, res) => {
    const { liveId } = req.params

    // await liveComments.find({ liveId: mongoose.Types.ObjectId(liveId) })
    await liveComments.aggregate([
        { $match: { liveId: mongoose.Types.ObjectId(liveId) } },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "user"
            }
        }
    ])
        .then((success) => {
            return res.json({
                status: true,
                message: "live comments",
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                status: false,
                message: "error"
            })
        })
}