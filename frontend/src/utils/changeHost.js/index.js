// TODO: fix this (use real host when uploading)
const changeHost = (str) => {
    return str.replace(".webp", "");
    // return str.replace("localhost", "10.22.18.11").replace(".webp", "");
    // return str.replace("localhost", "192.168.170.119").replace(".webp", "");
    // return str.replace("localhost", "dotdot.alirezashabany2004.ir").replace("node.alirezash20.ir","dotdot.alirezashabany2004.ir").replace("http://", "https://").replace(".webp", "");
}

export default changeHost;

