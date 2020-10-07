const ServiceHelper = require('../helper/ServiceHelper')
const ThreadPost = require('../models/ThreadPost')
const ThreadModerator = require('../models/ThreadModerator')
const { UnsupportedOperationError } = require('../models/errors')
const mobileForumService = require('../services/mobileForumService')

const mobileCommentService = {}

const UnsupportedOperationErrorEnum = {
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    COMMENT_NOT_EXISTS: 'COMMENT_NOT_EXIST',
    THREAD_NOT_EXISTS: 'THREAD_NOT_EXISTS'
}

// Change name from commentId to threadPostId here to match the column name in migration table
mobileCommentService.checkCommentMaker = async (threadPostId, userId) => {
    
    return ThreadPost.query()
    .findById(threadPostId)
    .where('ethreadpostcreateby', userId)
    .then(comment => {
        if(!comment) return false
        return true
    })

}

// Change name from commentId to threadPostId here to match the column name in migration table
mobileCommentService.checkMakerAndModerator = async (threadPostId, userId) => {

    return ThreadPost.query()
    .findById(threadPostId)
    .then(comment => {

        if(!comment) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMMENT_NOT_EXISTS)

        // if its the comment maker
        if(comment.ethreadpostcreateby === userId) return true

        //if not the maker, check if its the moderator
        return ThreadModerator.query()
        .where('ethreadethreadid', comment.ethreadethreadid)
        .where('eusereuserid', userId)
        .first()
        .then(moderator => {
            if(!moderator) return false
            return true
        })
    })

}

mobileCommentService.createComment = async (commentDTO, user) => {

    const threadExist = await mobileForumService.checkThread(commentDTO.ethreadethreadid)

    if(!threadExist) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_EXISTS)

    //Normalize fileId if frontend insert this kind of data
    if(commentDTO.efileefileid === undefined || commentDTO.efileefileid === null || commentDTO.efileefileid === 0) {
        commentDTO.efileefileid = null
    }

    return ThreadPost.query()
    .insertToTable(commentDTO, user.sub)

}

mobileCommentService.updateComment = async (commentId, commentDTO, user) => {

    const commentMaker = await mobileCommentService.checkCommentMaker(commentId, user.sub)

    if(!commentMaker)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    //Normalize fileId if frontend insert this kind of data
    if(commentDTO.efileefileid === undefined || commentDTO.efileefileid === null || commentDTO.efileefileid === 0) {
        commentDTO.efileefileid = null
    }

    return ThreadPost.query()
    .findById(commentId)
    .updateByUserId(commentDTO, user.sub)
    .returning('*')
    .then(comment => {
        if(!comment) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMMENT_NOT_EXISTS)
        return comment
    })

}

mobileCommentService.getAllComments = async (page, size, threadId) => {

    return ThreadPost.query()
    .where('ethreadethreadid', threadId)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

mobileCommentService.deleteComment = async (commentId, user) => {

    const checkMakerAndModerator = await mobileCommentService.checkMakerAndModerator(commentId, user.sub)

    if(!checkMakerAndModerator)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return ThreadPost.query()
    .delete()
    .where('ethreadpostid', commentId)
    .then(rowsAffected => rowsAffected === 1)

}

module.exports = mobileCommentService