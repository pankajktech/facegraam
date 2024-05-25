const datauri = require('datauri/parser.js');

const getDataUri = (file) => {
    const dUri = new datauri()
    return dUri.format(file.originalname, file.buffer);
    }

module.exports = getDataUri;