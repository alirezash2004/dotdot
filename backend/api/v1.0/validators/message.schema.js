export const newMessageSchema = {
    text: {
        exists: {
            errorMessage: 'text is required'
        },
        isEmpty: { negated: true },
        isLength: {
            errorMessage: "text must not exceed 300 characters.",
            options: {
                max: 300
            }
        },
        isString: {
            errorMessage: 'text must be a string'
        },
        trim: true,
        escape: true,
    }
}