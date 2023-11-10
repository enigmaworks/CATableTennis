export function rankByElo(users){
  users = users.sort((p1, p2)=>{
    if(p1.elo > p2.elo){
      return -1;
    } else if (p2.elo > p1.elo){
      return 1;
    } else {
      return 0;
    }
  });

  return users;
}

export function rankByWinPercent(users){
  users = users.sort((p1, p2)=>{
    if(p1.winpercent > p2.winpercent){
      return -1;
    } else if (p2.winpercent > p1.winpercent){
      return 1;
    } else {
      return 0;
    }
  });

  return users;
}

export function rankByTotalWins(users){
  users = users.sort((p1, p2)=>{
    if(p1.statistics.w > p2.statistics.w){
      return -1;
    } else if (p2.statistics.w > p1.statistics.w){
      return 1;
    } else {
      return 0;
    }
  });

  return users;
}

export function calculateEloAndWinPercents(users){
  users = users.map(user => {
    let percent = 0;
    if(user.statistics.w + user.statistics.l !== 0){
      percent = user.statistics.w / (user.statistics.w + user.statistics.l);
    }
    return {...user, winpercent: percent}
  });

  const usersWithRecords = users.filter(user => user.statistics.w + user.statistics.l > 0);
  const averageWinPercent = usersWithRecords.reduce((total, user) => { return total + user.winpercent}, 0) / usersWithRecords.length;
 
  const eloConstant = 7;
  
  users = users.map(user => {
    let calculatedElo = 0

    if(user.statistics.w + user.statistics.l !== 0){
      calculatedElo = (user.statistics.w + (eloConstant * averageWinPercent)) / (user.statistics.w + user.statistics.l + eloConstant);
    }

    return {...user, elo: calculatedElo}
  });

  return users;
}