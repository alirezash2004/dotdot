const followingRelationshipShcema = {
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        matches: {
            errorMessage: 'Only Numbers are accepted for pageId',
            options: /^\d+$/,
        },
        isEmpty: { negated: true },
        trim: true
    },
    followedPageId: {
        exists: {
            errorMessage: 'followedPageId is required'
        },
        matches: {
            errorMessage: 'Only Numbers are accepted for followedPageId',
            options: /^\d+$/,
        },
        isEmpty: { negated: true },
        trim: true
    },
}

export default followingRelationshipShcema;