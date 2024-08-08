export const updatePageSettingSchema = {
    theme: {
        exists: {
            errorMessage: 'Theme is required'
        },
        matches: {
            errorMessage: 'Unexpected theme format',
            options: /\b(dark|light)\b/,
        },
        trim: true,
        escape: true,
    },
    language: {
        exists: {
            errorMessage: 'Language is required'
        },
        matches: {
            errorMessage: 'Unexpected language format',
            options: /^[A-Za-z\s]+$/,
        },
        trim: true,
        escape: true,
    },
    country: {
        exists: {
            errorMessage: 'Country is required'
        },
        matches: {
            errorMessage: 'Unexpected country format',
            options: /^[A-Za-z\s]+$/,
        },
        trim: true,
        escape: true,
    }
}