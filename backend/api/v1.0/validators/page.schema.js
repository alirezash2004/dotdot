export const pageSchema = {
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
    fullName: {
        exists: {
            errorMessage: 'Fullname is required'
        },
        errorMessage: 'Fullname can only contain alphabet characters & must be 6-20 characters & can have 2 spaces in total',
        matches: { options: /^(?=.{6,20}$)[A-Za-z]+(?: [A-Za-z]+){0,2}$/ },
        trim: true,
        escape: true,
    },
    email: {
        exists: {
            errorMessage: 'Email is required'
        },
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
        exists: {
            errorMessage: 'Pagetype is required'
        },
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
}

export const newpageSchema = {
    username: {
        isEmpty: {
            errorMessage: 'Username can\'t be empty',
            negated: true
        },
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
        isEmpty: {
            errorMessage: 'Password can\'t be empty',
            negated: true
        },
        exists: {
            errorMessage: 'Password is required'
        },
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
    fullName: {
        isEmpty: {
            errorMessage: 'Fullname can\'t be empty',
            negated: true
        },
        exists: {
            errorMessage: 'Fullname is required'
        },
        errorMessage: 'Fullname can only contain alphabet characters & must be 6-20 characters & can have 2 spaces in total',
        matches: { options: /^(?=.{6,20}$)[A-Za-z]+(?: [A-Za-z]+){0,2}$/ },
        trim: true,
        escape: true,
    },
    email: {
        isEmpty: {
            errorMessage: 'Email can\'t be empty',
            negated: true
        },
        exists: {
            errorMessage: 'Email is required'
        },
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
}

export const pageUpdateSchema = {
    username: {
        optional: {
            options: { checkFalsy: true }
        },
        matches: {
            errorMessage: 'Username must be 6-10 characters and can only contains . and _ Username can\'t start with .',
            options: /^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
        },
        trim: true,
        escape: true,
    },
    password: {
        optional: {
            options: { checkFalsy: true }
        },
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
    newpassword: {
        exists: {
            if: (value, { req }) => !!req.body.password && req.body.password !== '',
        },
        isStrongPassword: {
            errorMessage: 'New Password must be at least 8 characters & contain at least one Upperacase letter, one number and one symbol',
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
    fullName: {
        optional: {
            options: { checkFalsy: true }
        },
        matches: {
            errorMessage: 'Fullname can only contain alphabet characters & must be 6-20 characters & can have 2 spaces in total',
            options: /^(?=.{6,20}$)[A-Za-z]+(?: [A-Za-z]+){0,2}$/
        },
        trim: true,
        escape: true,
    },
    email: {
        optional: { values: 'falsy' },
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
        matches: {
            errorMessage: 'pagetype can only be private or public',
            options: /\b(private|public)\b/
        }
    },
    theme: {
        matches: {
            errorMessage: 'Unexpected theme format',
            options: /\b(dark|light)\b/,
        },
        trim: true,
        escape: true,
    },
    language: {
        matches: {
            errorMessage: 'Unexpected language format',
            options: /^(^[A-Za-z\s]+$)?$/,
        },
        trim: true,
        escape: true,
    },
    // country: {
    //     matches: {
    //         errorMessage: 'Unexpected country format',
    //         options: /^[A-Za-z\s]+$/,
    //     },
    //     trim: true,
    //     escape: true,
    // },
    bio: {
        optional: {
            options: { checkFalsy: true }
        },
        matches: {
            errorMessage: 'Unexpected bio format',
            options: /[\p{L}\p{N}\s,.!?;:()'\"-]+|[\p{So}]/,
        },
        trim: true,
        escape: true,
    },
    website: {
        optional: {
            options: { checkFalsy: true }
        },
        matches: {
            errorMessage: 'Unexpected website format',
            options: /https?:\/\/[^\s/$.?#].[^\s]*\.(com|org|net|ir)(\/[^\s]*)?/,
        },
        trim: true,
    },
    birthdate: {
        optional: {
            options: { checkFalsy: true }
        },
        matches: {
            errorMessage: 'Unexpected birthdate format',
            options: /\b(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/, // YYYY-MM-DD
        },
        trim: true,
    }
};

export const updateProfileSchema = {
    fileAccesstoken: {
        exists: {
            errorMessage: 'Website is required'
        },
        matches: {
            errorMessage: "Unexpected fileAccesstoken",
            options: /^[a-z0-9]{72}$/,
        },
        trim: true,
    }
}