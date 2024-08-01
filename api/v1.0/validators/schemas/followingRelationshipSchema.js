const followingRelationshipShcema = {
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    },
    followedPageId: {
        exists: {
            errorMessage: 'followedPageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    },
}

export default followingRelationshipShcema;