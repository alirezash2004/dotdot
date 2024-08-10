const notificationIdSchema = {
    notificationId: {
        exists: {
            errorMessage: 'notificationId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
};

export default notificationIdSchema;