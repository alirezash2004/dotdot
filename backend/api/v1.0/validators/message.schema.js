export const newMessageSchema = {
    text: {
        optional: true,
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
    },
    post: {
        optional: true,
        isString: {
            errorMessage: 'post must be a string'
        },
        trim: true,
        escape: true
    }
}