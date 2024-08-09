const updateProfileSchema = {
    bio: {
        exists: {
            errorMessage: 'Bio is required'
        },
        matches: {
            errorMessage: 'Unexpected bio format',
            options: /[\p{L}\p{N}\s,.!?;:()'\"-]+|[\p{So}]/,
        },
        trim: true,
        escape: true,
    },
    website: {
        exists: {
            errorMessage: 'Website is required'
        },
        matches: {
            errorMessage: 'Unexpected website format',
            options: /https?:\/\/[^\s/$.?#].[^\s]*\.(com|org|net|ir)(\/[^\s]*)?/,
        },
        trim: true,
    },
    birthdate: {
        exists: {
            errorMessage: 'Birthdate is required'
        },
        matches: {
            errorMessage: 'Unexpected birthdate format',
            options: /\b(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/, // YYYY-MM-DD
        },
        trim: true,
    }
}

export default updateProfileSchema;