export const loginInputsSchema = {
    username: {
        exists: {
            errorMessage: 'Username is required'
        },
        matches: {
            errorMessage: 'Username must be 6-10 characters and can only contains . and _ Username can\'t start with .',
            options: /^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
        },
        trim: true,
        escape: true,
    },
    password: {
        exists: {
            errorMessage: 'Password is required'
        },
        trim: true,
        escape: true,
    },
};