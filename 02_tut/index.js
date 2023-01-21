const fsPromises = require("fs").promises;
const path = require("path");

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'foobar.txt'), 'utf8');
        console.log(data);
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNoicenoice');
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);
    } catch (err) {
        console.error(err);
    }
}

fileOps();

process.on("uncaughtException", err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})