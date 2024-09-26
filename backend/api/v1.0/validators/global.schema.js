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
        matches: {
            errorMessage: 'Username can only contains . and _ Username can\'t start with .',
            options: /^(?![0-9.])[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
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

export const followingRelationshipIdSchema = {
    id: {
        exists: {
            errorMessage: "id is required"
        },
        isString: {
            errorMessage: 'id must be a string'
        },
        isEmpty: { negated: true },
        trim: true,
    }
}