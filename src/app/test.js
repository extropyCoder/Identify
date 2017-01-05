var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

console.log(SHA256("Message"));
var ciphertext =CryptoJS.AES.encrypt("1234abcXdfts", "sonbol");
console.log(ciphertext.toString);
