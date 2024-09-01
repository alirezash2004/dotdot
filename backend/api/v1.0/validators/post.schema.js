export const postsSchema = {
    assetType: {
        matches: {
            errorMessage: 'assetType must be picture OR video',
            options: /\b(picture|video)\b/,
        },
        trim: true,
        escape: true,
    },
    caption: {
        matches: {
            errorMessage: 'caption has invalid charachter',
            options: /[\p{L}\p{N}\s,.!?;:()'\"-]+|[\p{So}]/,
        },
        trim: true,
        escape: true,
    },
    postmedia: {
        isObject: {
            errorMessage: 'postmedia must be an object',
            options: { strict: true },
        },
    }
};

export const postIdSchema = {
    postId: {
        exists: {
            errorMessage: 'postId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
};

export const postCommentSchema = {
    text: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true,
        escape: true
    }
};