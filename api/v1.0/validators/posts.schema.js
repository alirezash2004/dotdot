const postsSchema = {
    type: {
        matches: {
            errorMessage: 'type must be single OR multiple',
            options: /\b(single|multiple)\b/,
        },
        trim: true,
        escape: true,
    },
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
}

export default postsSchema;