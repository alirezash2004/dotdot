export let samplePages = [
    { id: 1, username: 'alireza.sh_20', fullname: 'Alireza Shabany', email: 'shbanylyrda32@gmail.com', password: '54d0c9864f57ab5d986620d2d6ac97a2866d4fab399e808e894416ff8407c8a871948dc2f4cf967f0df559bd7260b4604af0195f994e36d29b1a2d687a916c91', salt: 'd656f92bc2f7102681a43908dacc9e72111b2820da09d9237859aced8001a3cb', pageType: 'public', userSince: 'Wed Jul 17 2024 22:31:07 GMT+0330', lastLogin: 'Wed Jul 17 2024 22:31:07 GMT+0330', active: '1', profilePicture: '/assets/lfkdnerlasqwpasd.png' },
    { id: 2, username: 'ahmad.babaii2', fullname: 'Ahmad Babaii', email: 'ahmad213@yahoo.com', password: '54d0c9864f57ab5d986620d2d6ac97a2866d4fab399e808e894416ff8407c8a871948dc2f4cf967f0df559bd7260b4604af0195f994e36d29b1a2d687a916c91', salt: 'd656f92bc2f7102681a43908dacc9e72111b2820da09d9237859aced8001a3cb', pageType: 'private', userSince: 'Wed Jul 17 2024 22:31:07 GMT+0330', lastLogin: 'Wed Jul 17 2024 22:31:07 GMT+0330', active: '1', profilePicture: '/assets/vnssjefwlk.png' },
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