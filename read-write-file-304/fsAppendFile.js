import { appendFile } from 'fs/promises';
async function appendData(data) {
    try {
        await appendFile('./data.txt',data);
        console.log('File written successfully');
    } catch (err) {
        console.log(err);
    }
}
console.log('Start append a file...');
const info = 'This is the data that will be appended to the file.';
appendData(info);