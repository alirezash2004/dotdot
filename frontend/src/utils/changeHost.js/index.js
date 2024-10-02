// TODO: fix this (use real host when uploading)
const changeHost = (str) => {
    return str.replace("localhost", "10.61.18.10").replace(".webp", "");
    // return str.replace("localhost", "--WEBSITEURL--").replace("http", "https").replace(".webp", "");
}

export default changeHost;
