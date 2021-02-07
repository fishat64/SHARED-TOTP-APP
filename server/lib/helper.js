const config = require('../../config.json');

const changeByKey = function(obj, key, val) {
    obj[key] = val;
    return obj;
}

const newReturnValue = function() {
    return { error: null, result: null };
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const now = () => (new Date()).getTime();

const isDebug = () => config.DEBUG || false;

const base32RegExp = /^[A-Z2-7]+=*$/;

module.exports = {
    changeByKey,
    newReturnValue,
    delay,
    now,
    isDebug,
    base32RegExp
}