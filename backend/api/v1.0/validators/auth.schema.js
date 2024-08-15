export const loginInputsSchema = {
    username: {
        isEmpty: {
            errorMessage: 'Username can\'t be empty',
            negated: true
        },
        exists: {
            errorMessage: 'Username is required'
        },
        trim: true,
        escape: true,
    },
    password: {
        isEmpty: {
            errorMessage: 'Password can\'t be empty',
            negated: true
        },
        exists: {
            errorMessage: 'Password is required'
        },
        trim: true,
        escape: true,
    },
};