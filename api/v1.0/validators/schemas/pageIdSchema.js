const pageIdSchema = {
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
};

export default pageIdSchema;