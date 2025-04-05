const { seperator } = require("./enum");

const BASE62_ALPHABET = process.env["BASE62_ALPHABET"] || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateId(str) {
    return stringToBase62(str);
}

function decodeId(num) {
    return base62ToString(num)
}

function splitUsernameAndId(formattedStr) {
    const parts = formattedStr.split(seperator);
    return { username: parts[0], gameid: parts[1] };
}


function splitCommentIdAndId(formattedStr) {
    const parts = formattedStr.split(seperator);
    return { commentid: parts[0], gameid: parts[1], comment_category: parts[2] };
}

function stringToBase62(str) {
    let num = BigInt(0);
    for (let i = 0; i < str.length; i++) {
        num = num * BigInt(256) + BigInt(str.charCodeAt(i));
    }
    return encodeBase62(num);
}

function encodeBase62(num) {
    let encoded = "";
    while (num > 0) {
        encoded = BASE62_ALPHABET[num % BigInt(62)] + encoded;
        num = num / BigInt(62);
    }
    return encoded || "0";
}

function decodeBase62(str) {
    let num = BigInt(0);
    for (let i = 0; i < str.length; i++) {
        num = num * BigInt(62) + BigInt(BASE62_ALPHABET.indexOf(str[i]));
    }
    return num;
}

function base62ToString(encoded) {
    let num = decodeBase62(encoded);
    let str = "";
    while (num > 0) {
        str = String.fromCharCode(Number(num % BigInt(256))) + str;
        num = num / BigInt(256);
    }
    return str;
}

module.exports = { generateId, decodeId, splitUsernameAndId, splitCommentIdAndId };