const pageUpdateSchema = {
    username: {
        matches: {
            errorMessage: 'Username must be 6-10 characters and can only contains . and _ Username can\'t start with .',
            options: /^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
        },
        trim: true,
        escape: true,
    },
    password: {
        isStrongPassword: {
            errorMessage: 'Password must be at least 8 characters & contain at least one Upperacase letter, one number and one symbol',
            options: {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }
        },
        trim: true,
        escape: true,
    },
    fullname: {
        errorMessage: 'Fullname can only contain alphabet characters & must be 6-20 characters & can have 2 spaces in total',
        matches: { options: /^(?=.{6,20}$)[A-Za-z]+(?: [A-Za-z]+){0,2}$/ },
        trim: true,
        escape: true,
    },
    email: {
        isEmail: {
            errorMessage: 'only gmail is accepted',
            options: { host_whitelist: ['gmail.com'] }
        },
        normalizeEmail: {
            options: {
                all_lowercase: true,
                gmail_remove_dots: true,

            }
        },
        trim: true,
        escape: true,
    },
    pageType: {
        errorMessage: 'pagetype can only be private or public',
        matches: { options: /\b(private|public)\b/ }
    },
    pageSetting: {
        isObject: {
            errorMessage: 'pageSetting must be an object',
            options: { strict: true },
        },
    },
    'pageSetting.theme': {
        matches: {
            errorMessage: 'Unexpected theme format',
            options: /\b(dark|light)\b/,
        },
        trim: true,
        escape: true,
    },
    'pageSetting.language': {
        matches: {
            errorMessage: 'Unexpected language format',
            options: /^[A-Za-z\s]+$/,
        },
        trim: true,
        escape: true,
    },
    'pageSetting.country': {
        matches: {
            errorMessage: 'Unexpected country format',
            options: /^[A-Za-z\s]+$/,
        },
        trim: true,
        escape: true,
    },
    pageProfile: {
        isObject: {
            errorMessage: 'pageProfile must be an object',
            options: { strict: true },
        },
    },
    'pageProfile.bio': {
        exists: {
            errorMessage: 'Bio is required'
        },
        matches: {
            errorMessage: 'Unexpected bio format',
            options: /[\p{L}\p{N}\s,.!?;:()'\"-]+|[\p{So}]/,
        },
        trim: true,
        escape: true,
    },
    'pageProfile.website': {
        exists: {
            errorMessage: 'Website is required'
        },
        matches: {
            errorMessage: 'Unexpected website format',
            options: /https?:\/\/[^\s/$.?#].[^\s]*\.(com|org|net|ir)(\/[^\s]*)?/,
        },
        trim: true,
    },
    'pageProfile.birthdate': {
        exists: {
            errorMessage: 'Birthdate is required'
        },
        matches: {
            errorMessage: 'Unexpected birthdate format',
            options: /\b(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/, // YYYY-MM-DD
        },
        trim: true,
    }
};

export default pageUpdateSchema;