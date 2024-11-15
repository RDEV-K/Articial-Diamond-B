const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = (value) => {
    var value = jwt.sign(value,process.env.SECRET_KEY);
    return value;
};
module.exports = { token};
