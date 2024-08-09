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
        matches: {
            errorMessage: 'postmedia has invalid charachter',
            options: /(?:\"|\')(?<key>[\w\d]+)(?:\"|\')(?:\:\s*)(?:\"|\')?(?<value>[\w\s-]*)(?:\"|\')?/gm,
        },
        trim: true,
    }
}

export default postsSchema;