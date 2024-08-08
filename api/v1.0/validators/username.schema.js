const usernameSchema = {
    username: {
        exists: {
            errorMessage: 'username is required'
        },
        isEmpty: { negated: true },
        trim: true,
        escape: true,
    }
};

export default usernameSchema;