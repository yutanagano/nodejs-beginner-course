console.log("Hello world");

const os = require("os");
const path = require("path");

console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

console.log(path.parse(__filename));

// Import from our own modules
const { add, subtract, multiply, divide } = require("./math");

console.log(add(2,3));