import * as fs from "fs";
import data from "/data/users.json";

export const users = {
  getALl: () => data,
  findUser: (user) => data.find(user),
  findUserById: (id) =>  data.find(x => x.id.toString() === id.toString()),
  createUser: createfn,
  updateUser: updatefn,
  updateUserStats: updatestats,
  deleteUser: deletefn
}

function createfn (username, password, permisions, userinfo = {}){
  let user = {};
  //generate sequential user ids
  user.id = data.length ? Math.max(...data.map(x => x.id)) + 1 : 1;
  
  user.dateCreated = new Date().toISOString();
  user.dateUpdated = new Date().toISOString();
  user.lastStatUpdate = new Date().toISOString();

  user.username = username;
  user.password = password;
  user.permisions = permisions;

  user.info.firstname = userinfo.firstname || "user";
  user.info.lastname = userinfo.lastname || "";
  user.info.gradyear = userinfo.gradyear || "";
  
  user.statistics = {};

  data.push(user);
  saveData();
}

function deletefn (id) {
  data = data.filter(x => x.id.toString() !== id.toString());

  saveData();
}

function updatefn(id, newdata) {
  const user = data.find(x => x.id.toString() === id.toString());
  user = Object.assign(user, newdata);

  user.dateUpdated = new Date().toISOString();

  saveData();
}

function updatestats(id, season, w, l){
  const user = data.find(x => x.id.toString() === id.toString());
  
  user.statistics[season] = {w: w, l: l};
  user.lastStatUpdate = new Date().toISOString();

  saveData();
}

function saveData() {
  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}
