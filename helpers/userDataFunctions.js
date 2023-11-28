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
    "statistics": {"w": num, "l": num},
    "password": "string hash"
}
*/

import * as fs from "fs";
let data = require("/data/users.json");

const bcrypt = require ('bcrypt');
const saltRounds = 10;

export default {
  getAll: () => JSON.parse(JSON.stringify(data)),
  findUser: (username) => JSON.parse(JSON.stringify(data.find(x => x.username.toString() === username.toString()))),
  findUserById: (id) => JSON.parse(JSON.stringify(data.find(x => x.id.toString() === id.toString()))),
  createUser: createfn,
  updateUser: updatefn,
  deleteUser: deletefn,
  saveMatchResult: saveMatchResult
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
  
  user.statistics = {"w": 0, "l": 0};

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
  if(!user) return;
  
  const oldpassword = user.password;

  if(newdata.info){
    newdata.info = Object.assign(user.info, newdata.info);
  }
  if(newdata.statistics !== undefined){
    newdata.statistics = Object.assign(user.statistics, newdata.statistics);
  }

  user = Object.assign(user, newdata);
  user.permissions = parseInt(user.permissions);
  user.dateUpdated = new Date().toISOString();
  
  if(user.password !== oldpassword){
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      user.password = hash;
      saveData();
    });
  } else {
    saveData();
  }
}

function saveMatchResult(id, didwin){
  let user = data.find(x => x.id.toString() === id.toString());
  
  if(didwin){
    user.statistics.w += 1;
  } else {
    user.statistics.l += 1;
  }

  user.lastStatUpdate = new Date().toISOString();

  saveData();
}

function saveData() {
  fs.writeFileSync('data/users.json', JSON.stringify(data, null, 4));
}
