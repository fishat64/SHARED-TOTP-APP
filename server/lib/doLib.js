const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const uuidv4 = require('uuid').v4;

const config = require('../../config.json');

const db = require('./db');
const {
    syncfind,
    syncInsert,
    syncRemove,
    syncGetMaxVal
} = require('./dbHelper');

const generateToken = require('./generateToken').generateTOTP;
const Ex = require('./exceptionsHelper');

const {
    changeByKey,
    newReturnValue,
    delay,
    now,
    isDebug
} = require('./helper');


const createEntry = async function(password, token){
    const returnValue = newReturnValue();
    
    try {
        let tmpIdentifier = isDebug() ? config.DEBUGVALUES.uuidv4 : uuidv4();
        while((await syncfind(db.token, { identifier: tmpIdentifier })).length>0) {
            tmpIdentifier = uuidv4();
        }

        const identifier = tmpIdentifier;

        const hash = bcrypt.hashSync(password, 12);
        const encryptedHash = CryptoJS.AES.encrypt(hash, config.pepper).toString();
        const encryptedToken = CryptoJS.AES.encrypt(token, config.encToken).toString();

        const doc = {
            _id: (await syncGetMaxVal(db.token, {}, "_id"))+1,
            identifier: identifier, 
            encryptedHash: encryptedHash,
            encryptedToken: encryptedToken
        };

        await syncInsert(db.token, doc);

        changeByKey(returnValue, "result", { identifier });
    } catch(e) {
        let ErrorWert = ""+e;
        if(e != undefined){
            ErrorWert = e.name + ": " + e.message;
            console.debug(ErrorWert + " " + e.forAdmin);
        }
        const nErrorList = Array.isArray(returnValue.error) ? nErrorList.push(ErrorWert) : [ErrorWert];
        changeByKey(returnValue, "error", nErrorList);
    }
    

    return returnValue;
}

const getEntry = async function(identifier, password) {
    const returnValue = newReturnValue();

    const endAt = now() + config.minRuntime;

    try {
        let tokendatas = await syncfind(db.token, { identifier: identifier });
        if (!( tokendatas.length === 1 ) ) throw Ex.UserNotFoundException;

        const tokendata = tokendatas[0];
        const { encryptedHash, encryptedToken } = tokendata;

        const hash = CryptoJS.AES.decrypt(encryptedHash, config.pepper).toString(CryptoJS.enc.Utf8);
        
        if(! (await bcrypt.compare(password, hash))) throw Ex.PasswordWrongException;

        const token = CryptoJS.AES.decrypt(encryptedToken, config.encToken).toString(CryptoJS.enc.Utf8);
        const generatedOTP = generateToken(token);
        changeByKey(returnValue, "result", { identifier, otp: generatedOTP });
    } catch(e) {
        let ErrorWert = ""+e;
        if(e != undefined){
            ErrorWert = e.name + ": " + e.message;
            console.debug(ErrorWert + " " + e.forAdmin);
        }
        const nErrorList = Array.isArray(returnValue.error) ? nErrorList.push(ErrorWert) : [ErrorWert];
        changeByKey(returnValue, "error", nErrorList);
    }

    if(endAt>now()) await delay(endAt-now());

    return returnValue;
}

const removeEntry = async function(identifier, password) {
    const returnValue = newReturnValue();

    const endAt = now() + config.minRuntime;

    try {
        let tokendatas = await syncfind(db.token, { identifier: identifier });
        if (!( tokendatas.length === 1 ) ) throw Ex.UserNotFoundException;

        const tokendata = tokendatas[0];
        const { _id, encryptedHash, encryptedToken } = tokendata;
        const hash = CryptoJS.AES.decrypt(encryptedHash, config.pepper).toString(CryptoJS.enc.Utf8);
        if(! (await bcrypt.compare(password, hash))) throw Ex.PasswordWrongException;
        await syncRemove(db.token, { _id: _id });

        changeByKey(returnValue, "result", { identifier, token: encryptedToken, deleted: true });
    } catch(e) {
        let ErrorWert = ""+e;
        if(e != undefined){
            ErrorWert = e.name + ": " + e.message;
            console.debug(ErrorWert + " " + e.forAdmin);
        }
        const nErrorList = Array.isArray(returnValue.error) ? nErrorList.push(ErrorWert) : [ErrorWert];
        changeByKey(returnValue, "error", nErrorList);
    }
    
    if(endAt>now()) await delay(endAt-now());

    return returnValue;
}

module.exports = {
    createEntry,
    removeEntry,
    getEntry
}