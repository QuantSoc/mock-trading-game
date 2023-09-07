import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AuthError } from './error';
import { resolve } from 'path';

const lock = new AsyncLock();

const JWT_SECRET = 'abraCadabraDoo';
const DATABSE = './database.json';

/**************************************************************************
                                SERVER STATE
**************************************************************************/

let users = {};
let games = {};
let sessions = {};

const update = (users, games, sessions) =>
  new Promise((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(
          DATABSE,
          JSON.stringify({ users, games, sessions }, null, 4)
        );
        resolve();
      } catch {
        reject(new Error('Database update failed'));
      }
    });
  });

export const save = () => update(users, games, sessions);

export const reset = () => {
  update({}, {}, {});
  users = {};
  games = {};
  sessions = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABSE));
  users = data.users;
  games = data.games;
  sessions = data.sessions;
} catch {
  console.log('Database not found, generating new one.');
  save();
}

/**************************************************************************
                                  HELPERS
**************************************************************************/
const copy = (x) => JSON.parse(JSON.stringify(x));
// const userLock = function (callback) {
//   return new Promise((resolve, reject) => {
//     lock.acquire('userAuthLock', callback(resolve, reject));
//   })
// }
export const userLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('userAuthLock', callback(resolve, reject));
  });

export const gameLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('gameLock', callback(resolve, reject));
  });

export const sessionLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('sessionLock', callback(resolve, reject));
  });

const randomNumber = (max) =>
  Math.round(
    Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10)
  );

const generateRandomId = (currIds, max = 999999999) => {
  let randNum = randomNumber(max);
  while (currIds.includes(randNum)) {
    randNum = randomNumber(max);
  }
  return randNum.toString();
};

const newSessionId = () => generateRandomId(Object.keys(sessions), 999999);
const newGameId = () => generateRandomId(Object.keys(games));
const newTeamId = () =>
  generateRandomId(
    Object.keys(sessions).map((s) => Object.keys(sessions[s].teams))
  );

/**************************************************************************
                                AUTH FUNCTIONS
**************************************************************************/

export const parseEmailViaToken = (authHeader) => {
  try {
    const token = authHeader.split(' ')[1];
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in users)) {
      throw new AuthError('Invalid Token');
    }
    return email;
  } catch {
    throw new AuthError('Invalid Token');
  }
};

export const login = (email, password) =>
  userLock((resolve, reject) => {
    if (email in users && users[email].password === password) {
      users[email].isActive = true;
      resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' }));
    }
    reject(new InputError('Invalid Credentials'));
  });

export const logout = (email) =>
  userLock((resolve, reject) => {
    users[email].isActive = false;
    resolve();
  });

export const register = (email, password, username) =>
  userLock((resolve, reject) => {
    email in users
      ? reject(new InputError('Email already in use'))
      : (users[email] = {
          username,
          password,
          isActive: true,
        });
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
    resolve(token);
  });

/**************************************************************************
                              GAME FUNCTIONS
**************************************************************************/

const newGamePayload = (name, desc, owner) => ({
  name,
  desc,
  owner,
  sections: [],
  questions: [],
  active: null,
  createdAt: new Date().toISOString(),
});

export const assertGameOwner = (email, gameId) =>
  gameLock((resolve, reject) => {
    if (!(gameId in games)) {
      reject(new InputError('Game not found'));
    } else if (games[gameId].owner !== email) {
      reject(new InputError('You are not the owner of this game'));
    } else {
      resolve();
    }
  });

export const getUserOwnedGames = (email) =>
  gameLock((resolve, reject) => {
    resolve(
      Object.keys(games)
        .filter((gameId) => games[gameId].owner === email)
        .map((gameId) => ({
          id: parseInt(gameId, 10),
          name: games[gameId].name,
          owner: games[gameId].owner,
          active: getActiveGameSessionId(gameId),
          oldSessions: getInactiveGameSessions(gameId),
          createdAt: games[gameId].createdAt,
        }))
    );
  });

export const createGame = (name, desc, email) =>
  gameLock((resolve, reject) => {
    if (name === undefined) {
      reject(new InputError('Please give this quiz a name'));
    } else {
      const newId = newGameId();
      games[newId] = newGamePayload(name, desc, email);
      resolve(games[name]);
    }
  });

export const getGame = (gameId) =>
  gameLock((resolve, reject) => {
    resolve({
      ...games[gameId], // destructures all the game object entries
      active: getActiveGameSessionId(gameId),
      // oldSessions: getInactiveSessionsIdFromQuizId(quizId),
    });
  });

export const updateGame = (gameId, sections, name, desc, media) =>
  gameLock((resolve, reject) => {
    sections && (games[gameId].sections = sections);
    sections && (games[gameId].questions = flattenQuestions(sections));
    name && (games[gameId].name = name);
    desc && (games[gameId].desc = desc);
    media && (games[gameId].media = media);
    resolve();
  });

export const deleteGame = (gameId) =>
  gameLock((resolve, reject) => {
    delete games[gameId];
  });

export const startGame = (gameId) =>
  gameLock((resolve, reject) => {
    if (gameHasActiveSession(gameId)) {
      return reject(new InputError('Game already started'));
    } else {
      const id = newSessionId();
      sessions[id] = newSessionPayload(gameId);
      resolve(id);
    }
  });

export const advanceGame = (gameId) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSession(gameId);
    if (!session.active) {
      return reject(new InputError('Game not started'));
    }
    const questionsLength = session.questions.length;
    session.position += 1;
    session.answerAvailable = false;
    session.isoTimeLastQuestionStarted = new Date().toISOString();
    if (session.position >= questionsLength) {
      endGame(gameId);
    }
    resolve(session.position);
  });

export const endGame = (gameId) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSession(gameId);
    session.active = false;
    resolve();
  });

/**************************************************************************
                            SESSION FUNCTIONS
**************************************************************************/

const newSessionPayload = (gameId) => ({
  gameId,
  position: -1,
  timeStarted: new Date().toISOString(),
  teams: {},
  questions: copy(games[gameId].questions),
  active: true,
  answerAvailable: false,
});

const newTeamPayload = (teamName, questions) => {
  const teamAnswers = [];
  let latestSectionIndex = 0;
  questions.map((question, index) => {
    if (question.type === 'section') {
      teamAnswers.push({
        type: 'section',
        name: question.name,
        resultsIndex: 0,
      });

      latestSectionIndex = index;
    }
    if (question.type === 'round') {
      teamAnswers.push({
        type: 'round',
        markets: Object.keys(question.round).map((marketName) => {
          return {
            market: marketName,
            bid: 0,
            ask: 0,
            balance: 0,
            contracts: 0,
          };
        }),
      });
    }
    if (question.type === 'result') {
      teamAnswers[latestSectionIndex].resultsIndex = index;
      teamAnswers.push({
        type: 'result',
        markets: Object.keys(question.round).map((marketName) => {
          return {
            market: marketName,
            balance: 0,
            contracts: 0,
          };
        }),
      });
    }
  });

  return {
    name: teamName,
    teamAnswers,
  };
};

export const assertSessionOwner = async (email, sessionId) => {
  await assertGameOwner(email, sessions[sessionId].gameId);
};

export const sessionStatus = (sessionId, isTeam = false) => {
  if (!(sessionId in sessions)) {
    throw new InputError('Invalid session id');
  }
  const session = sessions[sessionId];
  return {
    active: session.active,
    position: session.position,
    questions: isTeam ? session.questions[session.position] : session.questions,
    teams: session.teams,
  };
};

export const sessionTeams = (sessionId, teamId) => {
  const session = sessions[sessionId];
  if (!(teamId in session.teams)) {
    throw new InputError('Invalid team');
  }
  return session.teams.map((team) => {
    return {
      name: team.name,
      teamAnswers: team.teamAnswers,
    };
  });
};

const gameHasActiveSession = (gameId) =>
  Object.keys(sessions).filter(
    (session) => sessions[session].gameId === gameId && sessions[session].active
  ).length > 0;

const getActiveGameSessionId = (gameId) => {
  const activeSessions = Object.keys(sessions).filter(
    (s) => sessions[s].gameId === gameId && sessions[s].active
  );
  if (activeSessions.length === 1) {
    return parseInt(activeSessions[0], 10);
  }
  return null;
};

const getActiveGameSession = (gameId) => {
  if (!gameHasActiveSession(gameId)) {
    throw new InputError('Game session inactive');
  }
  const sessionId = getActiveGameSessionId(gameId);
  return sessionId !== null ? sessions[sessionId] : null;
};

const getInactiveGameSessions = (gameId) => {
  return Object.keys(sessions)
    .filter(
      (seshId) => sessions[seshId].gameId === gameId && !sessions[seshId].active
    )
    .map((seshId) => {
      return {
        id: parseInt(seshId, 10),
        timeStarted: sessions[seshId].timeStarted,
      };
    });
};

const getActiveGameSessionFromSessionId = (sessionId) => {
  if (sessionId in sessions && sessions[sessionId].active) {
    return sessions[sessionId];
  }
  throw new InputError('Session is inactive');
};

const getInactiveGameSessionFromSessionId = (sessionId) => {
  if (sessionId in sessions && !sessions[sessionId].active) {
    return sessions[sessionId];
  }
  throw new InputError('Session is still active');
};

const getSessionIdFromTeamId = (teamId) => {
  for (const sessionId of Object.keys(sessions)) {
    if (
      Object.keys(sessions[sessionId].teams).filter((team) => team === teamId)
        .length > 0
    ) {
      return sessionId;
    }
  }

  throw new InputError('Team ID not found or invalid');
};

export const teamJoin = (name, sessionId) =>
  sessionLock((resolve, reject) => {
    if (name === undefined) {
      return reject(new InputError('Please give this team a name'));
    } else {
      const session = getActiveGameSessionFromSessionId(sessionId);
      if (session.position >= 0) {
        return reject(new InputError('Game session has already begun'));
      }

      if (
        Object.keys(session.teams).filter(
          (teamId) => session.teams[teamId].name === name
        ).length > 0
      ) {
        return reject(new InputError('Team already exists'));
      }

      const id = newTeamId();
      session.teams[id] = newTeamPayload(name, session.questions);
      resolve(parseInt(id, 10));
    }
  });

const flattenQuestions = (sections) => {
  const flatpack = [];

  sections.map((section, index) => {
    flatpack.push({
      type: 'section',
      name: `Section ${index + 1}`,
      marketsLength: section.markets.length,
    });

    const marketRounds = {};
    if (section.markets.length <= 0) {
      throw new InputError('Please create at least one market');
    }
    if (section.markets[0].rounds.length <= 0) {
      throw new InputError('Please create at least one round');
    }
    section.markets[0].rounds.map((round, index) => {
      section.markets.forEach((market) => {
        marketRounds[market.name] = market.rounds[index].hint;
      });
      flatpack.push({ type: 'round', round: { ...marketRounds } });
    });

    const marketResults = {};
    section.markets.map((market, index) => {
      marketResults[market.name] = market.trueValue;
    });
    flatpack.push({ type: 'result', round: marketResults });
  });

  return flatpack;
};

const getGameRound = (sections, position) => {
  let counter = -1;
  for (const market of sections) {
    counter += 1;

    for (const round of market.rounds) {
      counter += 1;
      if (counter === position) {
        return round;
      }
    }
  }
};

export const setTeamBidAsk = (teamId, bid, ask, marketIndex) =>
  sessionLock((resolve, reject) => {
    if (bid === undefined || ask === undefined) {
      return reject(new InputError('Must provide a bid and ask price'));
    } else {
      const session = getActiveGameSessionFromSessionId(
        getSessionIdFromTeamId(teamId)
      );
      if (session.position < 0) {
        return reject(new InputError('Game session has not begun'));
      } else if (session.answerAvailable) {
        return reject(new InputError('Trading has already begun.'));
      } else {
        const roundMarket =
          session.teams[teamId].teamAnswers[session.position].markets[
            marketIndex
          ];

        roundMarket.bid = parseFloat(bid, 10);
        roundMarket.ask = parseFloat(ask, 10);
        // const nextRound =
        //   session.teams[teamId].teamAnswers[session.position + 1];
        // nextRound.bid = parseFloat(bid, 10);
        // nextRound.ask = parseFloat(ask, 10);
      }
      resolve();
    }
  });

const checkValidTrade = (teams, position, buyerId, sellerId) => {
  return (
    teams[sellerId].teamAnswers[position].ask <=
    teams[buyerId].teamAnswers[position].bid
  );
};

const initiateTrade = (
  teams,
  position,
  marketPos,
  buyerId,
  sellerId,
  marketIndex
) => {
  const sellPrice =
    teams[sellerId].teamAnswers[position].markets[marketIndex].ask;
  const buyPrice =
    teams[buyerId].teamAnswers[position].markets[marketIndex].bid;

  if (sellPrice <= buyPrice) {
    const tradePrice =
      buyPrice === sellPrice ? buyPrice : (sellPrice + buyPrice) / 2;

    teams[buyerId].teamAnswers[position].markets[marketIndex].balance -=
      tradePrice;
    teams[buyerId].teamAnswers[position].markets[marketIndex].contracts += 1;
    const buyerBal =
      teams[buyerId].teamAnswers[position].markets[marketIndex].balance;
    const buyerCon =
      teams[buyerId].teamAnswers[position].markets[marketIndex].contracts;
    teams[buyerId].teamAnswers[position + 1].markets[marketIndex].balance =
      buyerBal;
    teams[buyerId].teamAnswers[position + 1].markets[marketIndex].contracts =
      buyerCon;

    teams[sellerId].teamAnswers[position].markets[marketIndex].balance +=
      tradePrice;
    teams[sellerId].teamAnswers[position].markets[marketIndex].contracts -= 1;
    const sellerBal =
      teams[sellerId].teamAnswers[position].markets[marketIndex].balance;
    const sellerCon =
      teams[sellerId].teamAnswers[position].markets[marketIndex].contracts;
    teams[sellerId].teamAnswers[position + 1].markets[marketIndex].balance =
      sellerBal;
    teams[sellerId].teamAnswers[position + 1].markets[marketIndex].contracts =
      sellerCon;

    // const buyerResIdx = teams[buyerId].teamAnswers[marketPos].resultsIndex;
    // teams[buyerId].teamAnswers[buyerResIdx].balance = buyerBal;
    // teams[buyerId].teamAnswers[buyerResIdx].contracts = buyerCon;

    // const sellerResIdx = teams[sellerId].teamAnswers[marketPos].resultsIndex;
    // teams[sellerId].teamAnswers[sellerResIdx].balance = sellerBal;
    // teams[sellerId].teamAnswers[sellerResIdx].contracts = sellerCon;
  }
};

export const trade = (sessionId, marketPos) =>
  sessionLock((resolve, reject) => {
    const session = getActiveGameSessionFromSessionId(sessionId);
    const teams = session.teams;
    if (session.position < 0) {
      return reject(new InputError('Game session has not begun'));
    } else {
      const teamIds = Object.keys(teams);
      if (teamIds.length <= 0) {
        resolve();
      }
      session.questions[session.position].hasTraded = true;
      const marketsLength =
        teams[teamIds[0]].teamAnswers[session.position].markets.length;
      setTimeout(() => {
        console.log('TRADING');
        for (let marketIndex = 0; marketIndex < marketsLength; marketIndex++) {
          teamIds.forEach((teamId) => {
            const buyerId = teamId;
            const sellerIds = teamIds.filter((id) => id !== teamId);

            sellerIds.forEach((sellerId) => {
              initiateTrade(
                teams,
                session.position,
                marketPos,
                buyerId,
                sellerId,
                marketIndex
              );
            });
          });
        }
      }, 7000);
      resolve();
    }
  });

export const calculateResults = (gameId, sessionId) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSessionFromSessionId(sessionId);
    if (!session.active) {
      return reject(new InputError('Game not started'));
    }

    resolve(session.position);
  });

/**************************************************************************
                                  HISTORY
**************************************************************************/
export const fetchSessionHistory = (sessionId) =>
  gameLock((resolve, reject) => {
    const session = getInactiveGameSessionFromSessionId(sessionId);
    resolve(session);
  });

export const setWinningTeams = (
  position,
  sessionId,
  teamId,
  marketIndex,
  isWinner
) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSessionFromSessionId(sessionId);
    if (!session.active) {
      return reject(new InputError('Game not started'));
    }
    const team =
      session.teams[teamId].teamAnswers[position].markets[marketIndex];
    team.isWinner = isWinner;
    resolve();
  });
