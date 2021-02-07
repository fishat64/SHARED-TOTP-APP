const syncfind = async function(database, query){
    return new Promise((resolve, reject) => {
        database.find(query, function(err, docs){
            if (!!err) reject(err);
            resolve(docs);
        });
    });
};

const syncRemove = async function(database, query){
    return new Promise((resolve, reject) => {
        database.remove(query, {}, function (err, numRemoved) {
            if (!!err) reject(err);
            resolve(numRemoved);
        });
    });
};


const syncInsert = async function(database, query){
    return new Promise((resolve, reject) => {
        database.insert(query, function (err, newDocs) {
            if (!!err) reject(err);
            resolve(newDocs);
        });
    });
};

const syncGetMaxVal = async function(database, query, hprop) {
    return new Promise((resolve, reject) => {
        database.find(query).sort({ [hprop]: -1 }).limit(1).exec(function (err, docs) {
            if (!!err) reject(err);
            if(docs.length < 1) resolve(0);
            else resolve(docs[0][hprop]);
        });
    });
}

module.exports = {
    syncfind,
    syncInsert,
    syncRemove,
    syncGetMaxVal
}