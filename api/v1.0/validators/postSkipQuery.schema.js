const postSkipQuery = {
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

export default postSkipQuery;