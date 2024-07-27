export let samplePages = [
    { id: 1, username: 'alireza.sh_20', fullname: 'Alireza Shabany', email: 'shbanylyrda32@gmail.com', password: '12345', pageType: 'public', userSince: 'Wed Jul 17 2024 22:31:07 GMT+0330', lastLogin: 'Wed Jul 17 2024 22:31:07 GMT+0330', active: '1', profilePicture: '/assets/lfkdnerlasqwpasd.png' },
    { id: 2, username: 'ahmad.babaii2', fullname: 'Ahmad Babaii', email: 'ahmad213@yahoo.com', password: '12345', pageType: 'private', userSince: 'Wed Jul 17 2024 22:31:07 GMT+0330', lastLogin: 'Wed Jul 17 2024 22:31:07 GMT+0330', active: '1', profilePicture: '/assets/vnssjefwlk.png' },
]

export let samplePageProfiles = [
    { bio: 'this is alireza"s bio', website: 'alirezash20.ir', birthdate: '1383/04/14', pageId: 1 },
    { bio: 'this is ahmad"s bio', website: 'ahmad.ir', birthdate: '1364/12/11', pageId: 2 }
]

export let samplepageSettings = [
    { theme: 'dark', language: 'en', country: 'us', pageId: 1 },
    { theme: 'light', language: 'fa', country: 'ir', pageId: 2 },
]

export let sampleFollowingRelationship = [
    { id: 1, pageId: 1, followedPageId: 2, followedAt: '' },
    { id: 2, pageId: 2, followedPageId: 1, followedAt: '' },
]