const postCommentSchema = {
    text: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true,
        escape: true
    }
}

export default postCommentSchema;