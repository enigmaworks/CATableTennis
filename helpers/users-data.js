/* SAMPLE USER OBJECT
{
    "id": num,
    "dateCreated": "ISO Date String",
    "dateUpdated": "ISO Date String",
    "lastStatUpdate": "ISO Date String",
    "username": "string",
    "flair": "string",
    "permissions": num (0-1),
    "info": {
        "firstname": "string",
        "lastname": "string",
        "gradyear": num
    },
    "statistics": {"num": {"w": num, "l": num}},
    "password": "string hash"
}
*/

import * as fs from "fs";
let data = require("/data/users.json");

const bcrypt = require ('bcrypt');
const saltRounds = 10;

export default {
  getAll: () => data,
  findUser: (username) => data.find(x => x.username.toString() === username.toString()),
  findUserById: (id) => data.find(x => x.id.toString() === id.toString()),
  createUser: createfn,
  updateUser: updatefn,
  updateUserStats: updatestats,
  deleteUser: deletefn
}

function createfn (username, password, permissions, userinfo = {}){
  let user = {};
  //generate sequential user ids
  user.id = data.length ? Math.max(...data.map(x => x.id)) + 1 : 1;
  
  user.dateCreated = new Date().toISOString();
  user.dateUpdated = new Date().toISOString();
  user.lastStatUpdate = new Date().toISOString();

  user.username = username;
  user.permissions = permissions;
 
  user.info = {};
  user.info.firstname = userinfo.firstname || "user";
  user.info.lastname = userinfo.lastname || "";
  user.info.gradyear = userinfo.gradyear || "";
  user.info.flair = userinfo.flair || "";
  
  user.statistics = {};

  bcrypt.hash(password, saltRounds, function(err, hash) {
    user.password = hash;
    data.push(user);
    saveData();
  });
}

function deletefn (id) {
  data = data.filter(x => x.id.toString() !== id.toString());

  saveData();
}

function updatefn(id, newdata) {
  let user = data.find(x => x.id.toString() === id.toString());
  user = Object.assign(user, newdata);

  user.dateUpdated = new Date().toISOString();

  saveData();
}

function updatestats(id, season, w, l){
  let user = data.find(x => x.id.toString() === id.toString());
  
  user.statistics[season] = {w: w, l: l};
  user.lastStatUpdate = new Date().toISOString();

  saveData();
}

function saveData() {
  fs.writeFileSync('data/users.json', JSON.stringify(data, null, 4));
}
