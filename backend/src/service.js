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
  markets: [],
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
          // oldSessions: getInactiveSessionsIdFromQuizId(quizId),
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

export const updateGame = (gameId, markets, name, desc, media) =>
  gameLock((resolve, reject) => {
    markets && (games[gameId].markets = markets);
    markets && (games[gameId].questions = flattenQuestions(markets));
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
  // isoTimeLastQuestionStarted: null,
  teams: {},
  questions: copy(games[gameId].questions),
  active: true,
  answerAvailable: false,
});

const newTeamPayload = (name, questions) => {
  const teamAnswers = [];

  questions.map((question) => {
    question.type === 'market' &&
      teamAnswers.push({
        type: 'market',
        market: question.name,
        balance: 0,
        contracts: 0,
      });
    question.type === 'round' && teamAnswers.push({ type: 'round' });
    question.type === 'trade' &&
      teamAnswers.push({
        type: 'trade',
        questionStartedAt: null,
        answeredAt: null,
        bid: 0,
        ask: 0,
        correct: false,
      });
    question.type === 'result' &&
      teamAnswers.push({ type: 'result', trueValue: question.trueValue });
  });

  return {
    name,
    teamAnswers,
  };
};

export const assertSessionOwner = async (email, sessionId) => {
  await assertGameOwner(email, sessions[sessionId].gameId);
};

export const sessionStatus = (sessionId) => {
  const session = sessions[sessionId];
  return {
    active: session.active,
    position: session.position,
    questions: session.questions,
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

const getInactiveGameSessons = (gameId) => {
  Object.keys(sessions)
    .filter(
      (seshId) => sessions[seshId].gameId === gameId && !sessions[seshId].active
    )
    .map((seshId) => parseInt(seshId, 10));
};

const getActiveGameSessionFromSessionId = (sessionId) => {
  if (sessionId in sessions && sessions[sessionId].active) {
    return sessions[sessionId];
  }
  throw new InputError('Session ID is inactive');
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

const flattenQuestions = (markets) => {
  const flatpack = [];

  markets.map((market) => {
    flatpack.push({ type: 'market', name: market.name });
    market.rounds.map((round, index) => {
      flatpack.push({ type: 'round', round: index + 1, hint: round.hint });
      flatpack.push({ type: 'trade' });
    });
    flatpack.push({ type: 'result', trueValue: market.trueValue });
  });

  return flatpack;
};

const getGameRound = (markets, position) => {
  let counter = -1;
  for (const market of markets) {
    counter += 1;

    for (const round of market.rounds) {
      counter += 1;
      if (counter === position) {
        return round;
      }
    }
  }
};

export const setTeamBidAsk = (teamId, bid, ask) =>
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
        const round = session.teams[teamId].teamAnswers[session.position];

        round.bid = parseFloat(bid, 10);
        round.ask = parseFloat(ask, 10);
        const nextRound =
          session.teams[teamId].teamAnswers[session.position + 1];
        nextRound.bid = parseFloat(bid, 10);
        nextRound.ask = parseFloat(ask, 10);
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

const initiateTrade = (teams, position, marketPos, buyerId, sellerId) => {
  const sellPrice = teams[sellerId].teamAnswers[position].ask;
  const buyPrice = teams[buyerId].teamAnswers[position].bid;

  if (sellPrice <= buyPrice) {
    const tradePrice =
      buyPrice === sellPrice ? buyPrice : (sellPrice + buyPrice) / 2;
    teams[buyerId].teamAnswers[marketPos].balance -= tradePrice;
    teams[buyerId].teamAnswers[marketPos].contracts += 1;
    teams[sellerId].teamAnswers[marketPos].balance += tradePrice;
    teams[sellerId].teamAnswers[marketPos].contracts -= 1;
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
      teamIds.forEach((teamId) => {
        const buyerId = teamId;
        const sellerIds = teamIds.filter((id) => id !== teamId);

        sellerIds.forEach((sellerId) => {
          initiateTrade(teams, session.position, marketPos, buyerId, sellerId);
        });
      });
      resolve();
    }
  });
