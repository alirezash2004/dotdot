export const skipQuerySchema = {
    skip: {
        exists: {
            errorMessage: 'Skip is required'
        },
        isInt: {
            errorMessage: 'Skip is not valid'
        },
        toInt: true,
    },
};

export const usernameSchema = {
    username: {
        exists: {
            errorMessage: 'username is required'
        },
        isEmpty: { negated: true },
        trim: true,
        escape: true,
    }
};

export const pageIdSchema = {
    pageId: {
        exists: {
            errorMessage: "pageId is required"
        },
        isEmpty: { negated: true },
        trim: true,
    }
}