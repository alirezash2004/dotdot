export let posts = [
    { id: 1, pageId: 1, type: 'single', assetType: 'picture', caption: 'this is a caption for my first post.', createdAt: 'Mon Jul 22 2024 11:22:41 GMT+0330 (وقت عادی ایران)', shareCount: 1, LikeCount: 3 },
    { id: 2, pageId: 1, type: 'single', assetType: 'picture', caption: 'this is a caption for my second post.', createdAt: 'Mon Jul 22 2024 11:24:01 GMT+0330 (وقت عادی ایران)', shareCount: 5, LikeCount: 7 },
];

export let postComments = [
    { id: 1, pageId: 1, comment: 'my very first comment on first post', commentSent: 'Mon Jul 22 2024 11:26:12 GMT+0330 (وقت عادی ایران)', postId: 1 },
    { id: 2, pageId: 1, comment: 'my second comment on first post', commentSent: 'Mon Jul 22 2024 11:36:12 GMT+0330 (وقت عادی ایران)', postId: 1 }
];

export let postMedia = [
    { id: 1, postId: 1, slideNumber: 0, assetUrl: '/assets/pic.jpg' },
    { id: 1, postId: 2, slideNumber: 0, assetUrl: '/assets/pic.jpg' },
];