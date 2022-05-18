const Datastore = require('nedb');
const db = {
  project: new Datastore({ filename: 'data/db/project' })
};

db.project.loadDatabase();

/* db.project.insert([{ name: 'abc' }])

console.log(db.project); */

module.exports = db;
