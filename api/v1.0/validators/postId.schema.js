const postIdSchema = {
    postId: {
        exists: {
            errorMessage: 'postId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
};

export default postIdSchema;