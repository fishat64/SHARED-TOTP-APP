const Datastore = require('nedb');
const path = require('path');

const db = {};

db.token = new Datastore({ filename: './server/db/token.db', autoload: true });

module.exports = db;